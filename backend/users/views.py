from django.contrib.auth import authenticate, login, get_user_model
from django.shortcuts import render, redirect, get_object_or_404
from django.db import IntegrityError
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.utils.dateparse import parse_date
from django.utils import timezone
from django.db.models import Q, Sum, F, Count, Min
from datetime import datetime, timedelta
from django.utils.timezone import now
from geopy.distance import geodesic
import logging
import json
import math
import requests
from django.conf import settings
from .models import Message


from .models import CustomUser, Volunteer, Skill, Organisation, Need, HumanNeed, MaterialNeed, FinancialNeed, Event






logger = logging.getLogger(__name__)
CustomUser = get_user_model()  # Utiliser le modèle utilisateur personnalisé

@csrf_exempt
def sign_in(request):
    if request.method == "POST":
        try:
            identifier = request.POST.get('identifier')  # Peut être email, username ou téléphone
            password = request.POST.get('password')
            print("id:", identifier)  # Debugging line

            user = None  # Initialize user
            # Vérifier avec username, email ou téléphone
            if CustomUser.objects.filter(username=identifier).exists():
                user = authenticate(request, username=identifier, password=password)
            elif CustomUser.objects.filter(email=identifier).exists():
                user_obj = CustomUser.objects.get(email=identifier)
                user = authenticate(request, username=user_obj.username, password=password)
            elif CustomUser.objects.filter(telephone=identifier).exists():
                user_obj = CustomUser.objects.get(telephone=identifier)
                user = authenticate(request, username=user_obj.username, password=password)

            # Vérifier si l'utilisateur est authentifié
            if user is None:
                logger.error("Erreur lors de la connexion : utilisateur non trouvé")
                return render(request, 'signIn.html', {'error': "Utilisateur non trouvé."})

            # Authentifier et connecter l'utilisateur
            login(request, user)
            print(request.session.session_key)


            # Redirection en fonction du rôle
            if user.role == "volunteer":
                return redirect('volunteerHomepage')
            else:
                return redirect('organisationHomepage')

        except Exception as e:
            logger.error(f"Erreur lors de la connexion : {str(e)}")
            return render(request, 'signIn.html', {'error': "Une erreur s'est produite."})

    return render(request, 'signIn.html')

@csrf_exempt
def sign_up_organisation(request):
    if request.method == "POST":
        username = request.POST.get('username')
        location = request.POST.get('location')
        description = request.POST.get('description')
        email = request.POST.get('email')
        telephone = request.POST.get('phone')
        password = request.POST.get('password')
        password2 = request.POST.get('password2')
        role = "organisation"

        if password != password2:
            return render(request, 'sign_up_organisation.html', {'error': "Les mots de passe ne correspondent pas."})

        if CustomUser.objects.filter(username=username).exists():
            return render(request, 'sign_up_organisation.html', {'error': "Le nom d'utilisateur est déjà utilisé."})

        if CustomUser.objects.filter(email=email).exists():
            return render(request, 'sign_up_organisation.html', {'error': "Cet email est déjà utilisé."})

        if CustomUser.objects.filter(telephone=telephone).exists():
            return render(request, 'sign_up_organisation.html', {'error': "Ce numéro de téléphone est déjà utilisé."})

        try:
            user = CustomUser.objects.create_user(
                username=username, email=email, telephone=telephone, password=password, role=role
            )

            organisation = Organisation.objects.create(
                user=user,
                description=description,
                location=location
            )

            login(request, user)
            return redirect('organisationHomepage')

        except Exception as e:
            logger.error(f"Erreur lors de l'inscription : {str(e)}")
            return render(request, 'sign_up_organisation.html', {'error': "Une erreur s'est produite."})

    return render(request, 'sign_up_organisation.html')

@csrf_exempt
def sign_up_volunteer(request):
    if request.method == "POST":
        username = request.POST.get('username')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        password = request.POST.get('password')
        password2 = request.POST.get('password2')
        birth_date = request.POST.get('birthDate')
        selected_skills = request.POST.getlist('skills')  # Récupérer les compétences sélectionnées
        print(username)
        print(email)
        print(phone)
        if not username or not email or not phone or not password or not birth_date:
            return render(request, 'sign_up_volunteer.html', {'error': "Tous les champs sont requis.", 'skills': Skill.objects.all()})

        if password != password2:
            return render(request, 'sign_up_volunteer.html', {'error': "Les mots de passe ne correspondent pas.", 'skills': Skill.objects.all()})

        try:
            user = CustomUser.objects.create_user(
                username=username, email=email, telephone=phone, password=password, role='volunteer'
            )
            print(user)

            volunteer = Volunteer.objects.create(user=user, birthDate=birth_date)

            # Ajouter les compétences sélectionnées
            for skill_id in selected_skills:
                skill = Skill.objects.get(id=skill_id)
                volunteer.skills.add(skill)

            login(request, user)
            return redirect('volunteerHomepage')

        except IntegrityError:
            return render(request, 'sign_up_volunteer.html', {'error': "Nom d'utilisateur, email ou téléphone déjà utilisé.", 'skills': Skill.objects.all()})
        except Exception as e:
            logger.error(f"Erreur lors de l'inscription : {str(e)}")
            return render(request, 'sign_up_volunteer.html', {'error': "Une erreur s'est produite.", 'skills': Skill.objects.all()})

    skills = Skill.objects.all()
    return render(request, 'sign_up_volunteer.html', {'skills': skills})
@csrf_exempt
def volunteerHomepage(request):
    return render(request, 'volunteerHomepage.html')


@csrf_exempt
def organisationHomepage(request):
    return render(request, 'organisationHomepage.html')

@csrf_exempt
def home(request):
    return render(request, 'home.html') 

def scheduleVolunteer(request):
    user = request.user
    volunteer = Volunteer.objects.get(user=request.user)  # Get the logged-in volunteer
    return render(request, 'scheduleVolunteer.html', {'volunteer': volunteer})

def contributeVolunteer(request):
    user = request.user
    volunteer = Volunteer.objects.get(user=request.user)  # Get the logged-in volunteer
    return render(request, 'contributeVolunteer.html', {'volunteer': volunteer})

def addEventPage(request):
    return render(request, 'addEvent.html')

@csrf_exempt
def filter_needs(request, category):
    current_time = now()
    today = current_time.date()

    volunteer = request.user.volunteer

    needs = volunteer.needs.all()

    needsRendered = None  

    if category == "Past Contributions":
        past_needs = needs.filter(date__lt=today)
        past_human_needs = needs.filter(type="human", date=today, human_need__endTime__lt=current_time.time())
        needsRendered = past_needs | past_human_needs

    elif category == "Next Contributions":
        future_needs = needs.filter(date__gte=today)
        future_human_needs = needs.filter(type="human", date=today, human_need__endTime__gte=current_time.time())
        needsRendered = future_needs | future_human_needs
        print(needsRendered)


    return render(request, "needPartialFiltered.html", {
        "needs": needsRendered,
        "category": category,
        "volunteer": volunteer
    }) 
@csrf_exempt    
def filterNeedExplore(request, category):
    current_time = now()
    today = current_time.date()
    
    valid_needs = Need.objects.filter(date__gte=today)  # Get all future needs

    unfulfilled_human_needs = valid_needs.filter(
        type="human",
    ).filter(
        Q(date__gt=today) |  # Future needs (ignore time)
        Q(date=today, human_need__endTime__gte=current_time.time())  # Ongoing needs today
    )

    unfulfilled_material_needs = valid_needs.filter(
        type="material",
        material_need__itemCount__lt=F("material_need__requiredQuantity"),
        date__gte=today
    )

    unfulfilled_financial_needs = valid_needs.filter(
    type="financial",
    date__gte=today,
    financial_need__amountCollected__lt=F("financial_need__amountRequired") 
    )

    needsFiltered = None
    
    
    if category.strip() == "Financial Support":
        needsFiltered = unfulfilled_financial_needs
    elif category.strip() == "materials and food support":
        needsFiltered = unfulfilled_material_needs
    else:     
        needsFiltered = unfulfilled_human_needs

    
    return render(request, "needPartial.html", {"needs": needsFiltered, "category": category, "volunteer": request.user.volunteer})
@csrf_exempt
def join_need(request, need_id):
    user = request.user  
    need = get_object_or_404(Need, id=need_id)

    volunteer, created = Volunteer.objects.get_or_create(user=user)
    already_joined = need.volunteers.filter(id=volunteer.id).exists()

    if need.type == "human":
        if already_joined:
            return JsonResponse({"error": "You have already contributed to this need!"}, status=400)

        if need.human_need.volunteersCount >= need.human_need.requiredPeople:
            return JsonResponse({"error": "Max volunteers already reached!"}, status=400)

        # Update the count and save
        need.human_need.volunteersCount += 1
        need.human_need.save()

        # Update volunteer's hours based on the duration of the human need
        volunteer.hoursVolunteered += (need.human_need.endTime.hour - need.human_need.startTime.hour)
        volunteer.save()

        need.volunteers.add(volunteer)

    elif need.type == "material":
        if need.material_need.itemCount >= need.material_need.requiredQuantity:
            return JsonResponse({"error": "Max material donations already reached!"}, status=400)
        
        # Get the amount of items donated from the request
        items_donated = request.POST.get("amount", 1)  # Default to 1 if not provided
        try:
            items_donated = int(items_donated)  # Convert to integer
        except ValueError:
            return JsonResponse({"error": "Invalid quantity"}, status=400)
        
        if items_donated <= 0:
            return JsonResponse({"error": "Donation quantity must be positive"}, status=400)
            
        # Check if donation would exceed the required quantity
        remaining_needed = need.material_need.requiredQuantity - need.material_need.itemCount
        if items_donated > remaining_needed:
            return JsonResponse({"error": f"Only {remaining_needed} more items needed. Please adjust your donation."}, status=400)
        
        # Update the count with the donated amount
        need.material_need.itemCount += items_donated
        need.material_need.save()
        need.volunteers.add(volunteer)
    elif need.type == "financial":
        if need.financial_need.amountCollected >= need.financial_need.amountRequired:
            return JsonResponse({"error": "Max financial donations already reached!"}, status=400)
        
        # Get the amount of items donated from the request
        items_donated = request.POST.get("amount", 1)  # Default to 1 if not provided
        try:
            items_donated = int(items_donated)  # Convert to integer
        except ValueError:
            return JsonResponse({"error": "Invalid quantity"}, status=400)
        
        if items_donated <= 0:
            return JsonResponse({"error": "Donation quantity must be positive"}, status=400)
            
        # Check if donation would exceed the required quantity
        remaining_needed = need.financial_need.amountRequired - need.financial_need.amountCollected
        if items_donated > remaining_needed:
            return JsonResponse({"error": f"Only {remaining_needed} more items needed. Please adjust your donation."}, status=400)
        
        # Update the count with the donated amount
        need.financial_need.amountCollected += items_donated
        need.financial_need.save()
        need.volunteers.add(volunteer)

    else:
        return JsonResponse({"error": "Invalid need type!"}, status=400)

    need.save()
    return JsonResponse({'message': 'Successfully joined the need!'})


@csrf_exempt
def create_event(request):
    if request.method == "POST":
        event_name = request.POST.get("eventName", "").strip()
        description = request.POST.get("description", "").strip()
        date_start = request.POST.get("dateStart", "").strip()
        date_end = request.POST.get("dateEnd", "").strip()

        # Get the organisation linked to the logged-in user
        user = request.user
        organisation = Organisation.objects.filter(user=user).first()

        if not organisation:
            return render(request, "addEvent.html", {"error": "No organisation found for this user."})

        # Convert date strings to date objects
        date_start = parse_date(date_start) if date_start else None
        date_end = parse_date(date_end) if date_end else None

        # Check for overlapping events
        overlapping_events = Event.objects.filter(
            organisation=organisation
        ).filter(
            Q(dateStart__lte=date_end, dateEnd__gte=date_start)  # Overlapping condition
        )

        if overlapping_events.exists():
            print(f'overlapping_events')
            return render(request, "addEvent.html", {"error": "Another event from your organization already exists in this period."})

        # Create the event
        event = Event.objects.create(
            eventName=event_name,
            description=description,
            dateStart=date_start,
            dateEnd=date_end,
            organisation=organisation
        )

        print(f'Event Created: {event}')

        # Handling multiple needs
        need_titles = request.POST.getlist("need_title")
        need_descriptions = request.POST.getlist("need_description")
        need_types = request.POST.getlist("need_type")

        for i in range(len(need_titles)):
            need = Need.objects.create(
                title=need_titles[i].strip(),
                description=need_descriptions[i].strip(),
                type=need_types[i],
                organisation=organisation,
                event=event
            )

            if need_types[i] == "human":
                required_people = int(request.POST.getlist("required_people")[i])
                skill_id = request.POST.getlist("skill")[i]
                skill = Skill.objects.filter(id=skill_id).first()
                start_time = request.POST.getlist("start_time")[i]
                end_time = request.POST.getlist("end_time")[i]
                HumanNeed.objects.create(
                    need=need,
                    requiredPeople=required_people,
                    skill=skill,
                    startTime=start_time,
                    endTime=end_time
                )

            elif need_types[i] == "material":
                required_quantity = int(request.POST.getlist("required_quantity")[i])
                MaterialNeed.objects.create(need=need, requiredQuantity=required_quantity)

            elif need_types[i] == "financial":
                amount_required = float(request.POST.getlist("amount_required")[i])
                FinancialNeed.objects.create(need=need, amountRequired=amount_required)
        skills = Skill.objects.all()

        return redirect("organisationHomepage")  # Redirect directly to organization homepage

@csrf_exempt
def event_list(request):
    events = Event.objects.all()
    return render(request, 'event_list.html', {'events': events})
 


    return JsonResponse(data)
@csrf_exempt
def calculate_event_progress(event):
    needs = Need.objects.filter(event=event)
    total_progress = 0
    need_count = needs.count()

    for need in needs:
        if need.type == "human":
            progress = 100 if datetime.now() > need.date else 0
        elif need.type == "material":
            progress = (need.material_need.itemCount / need.material_need.requiredQuantity) * 100 if need.material_need and need.material_need.requiredQuantity > 0 else 0
        elif need.type == "financial":
            progress = (need.financial_need.amountCollected / need.financial_need.amountRequired) * 100 if need.financial_need and need.financial_need.amountRequired > 0 else 0
        else:
            progress = 0

        total_progress += progress

    overall_progress = total_progress / need_count if need_count > 0 else 0
    return round(overall_progress, 2)


@csrf_exempt
def dashboard_opportunities(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "User not authenticated"}, status=401)

    if request.user.role != "organisation":
        return JsonResponse({"error": "User is not an organisation"}, status=403)

    organisation = get_object_or_404(Organisation, user=request.user)

    events = Event.objects.filter(need__organisation=organisation).distinct()

    event_data = []

    for event in events:
        if event.dateEnd and event.dateEnd < now().date():
            status = "Completed"
        elif event.dateStart > now().date():
            status = "Not Yet"
        else:
            status = "On Going"

        progress = calculate_event_progress(event)

        event_data.append({
            "eventName": event.eventName,
            "dateStart": event.dateStart,
            "dateEnd": event.dateEnd,
            "status": status,
            "progress": progress,
        })

    return JsonResponse({"events": event_data})

def dashboard_orga(request):
    thirty_days_ago = timezone.now().date() - timedelta(days=30)
    
    # Filtering events from the last 30 days
    recent_events = Event.objects.filter(dateStart__gte=thirty_days_ago)
    
    # Number of volunteers in human needs
    human_volunteers = HumanNeed.objects.filter(need__date__gte=thirty_days_ago).aggregate(
        total_volunteers=Sum('volunteersCount')
    )["total_volunteers"] or 0
    
    # Count of events done (ended in the last 30 days)
    events_done = recent_events.filter(dateEnd__lt=timezone.now().date()).count()
    
    # Count of ongoing events (started but not ended yet)
    events_ongoing = recent_events.filter(dateStart__lte=timezone.now().date(), dateEnd__gte=timezone.now().date()).count()
    
    # Number of ongoing needs
    needs_ongoing = Need.objects.filter(date__gte=thirty_days_ago).count()
    
    # Collect event-wise stats
    event_stats = []
    for event in recent_events:
        financial_collected = FinancialNeed.objects.filter(need__event=event).aggregate(
            total_collected=Sum('amountCollected')
        )["total_collected"] or 0
        
        material_collected = MaterialNeed.objects.filter(need__event=event).aggregate(
            total_collected=Sum('itemCount')
        )["total_collected"] or 0
        
        human_collected = HumanNeed.objects.filter(need__event=event).aggregate(
            total_collected=Sum('volunteersCount')
        )["total_collected"] or 0
        
        event_stats.append({
            "event_name": event.eventName,
            "financial_collected": float(financial_collected),
            "material_collected": material_collected,
            "human_collected": human_collected
        })
    
    # Response data
    data = {
        "human_volunteers": human_volunteers,
        "events_done": events_done,
        "events_ongoing": events_ongoing,
        "needs_ongoing": needs_ongoing,
        "event_details": event_stats
    }
    
    return JsonResponse(data)

@csrf_exempt
def listVolunteers(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "User not authenticated"}, status=401)

    if request.user.role != "organisation":
        return JsonResponse({"error": "User is not an organisation"}, status=403)

    organisation = get_object_or_404(Organisation, user=request.user)

    # Get all events organized by this organisation
    events = Event.objects.filter(organisation=organisation)
    total_events = events.count()

    if total_events == 0:
        return JsonResponse({"error": "No events found for this organisation"}, status=404)

    # Get volunteers who participated in all events of this organisation
    volunteers = Volunteer.objects.annotate(
        event_count=Count("needs__event", distinct=True)
    ).filter(
        event_count=total_events,
        needs__event__organisation=organisation
    ).distinct()

    # Format the response
    volunteer_list = [
        {
            "name": f"{volunteer.user.first_name} {volunteer.user.last_name}",
            "email": volunteer.user.email,
            "skills": [skill.name for skill in volunteer.skills.all()],
        }
        for volunteer in volunteers
    ]

    return JsonResponse({"volunteers": volunteer_list}, safe=False)

@csrf_exempt
def getVolunteerProfile(request, volunteer_id):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "User not authenticated"}, status=401)

    if request.user.role != "organisation":
        return JsonResponse({"error": "User is not an organisation"}, status=403)

    # Get the volunteer
    volunteer = get_object_or_404(Volunteer, id=volunteer_id)

    # Get all events where the volunteer participated
    events = Event.objects.filter(needs__volunteers=volunteer).distinct()

    # Format the response
    profile_data = {
        "name": f"{volunteer.user.first_name} {volunteer.user.last_name}",
        "email": volunteer.user.email,
        "birthDate": volunteer.birthDate,
        "hoursVolunteered": volunteer.hoursVolunteered,
        "moneyVolunteered": str(volunteer.moneyVolunteered),
        "skills": [skill.name for skill in volunteer.skills.all()],
        "events": [
            {
                "id": event.id,
                "eventName": event.eventName,
                "dateStart": event.dateStart.strftime("%Y-%m-%d") if event.dateStart else None,
                "dateEnd": event.dateEnd.strftime("%Y-%m-%d") if event.dateEnd else None,
                "description": event.description,
                "organisation": event.organisation.user.username if event.organisation else None,
            }
            for event in events
        ],
    }

    return JsonResponse(profile_data, safe=False)


def forum_view(request):
    messages = Message.objects.all()
    return render(request, 'forum.html', {'messages': messages})


def send_message(request):
    if request.method == 'POST':
        content = request.POST.get('message')
        if content:
            Message.objects.create(user=request.user, content=content)
            return JsonResponse({'success': True})
    return JsonResponse({'success': False})

    
def get_messages(request):
    messages = Message.objects.all().order_by('-timestamp')
    data = {
        "messages": [
            {"user": msg.user.username, "content": msg.content, "timestamp": msg.timestamp.strftime("%Y-%m-%d %H:%M")}
            for msg in messages
        ]
    }
    return JsonResponse(data)
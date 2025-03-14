from django.contrib.auth import authenticate, login, get_user_model
from django.shortcuts import render, redirect
from django.db import IntegrityError
from django.views.decorators.csrf import csrf_exempt
import logging
from .models import Event, CustomUser, Volunteer, Skill, Organisation, HumanNeed, MaterialNeed, FinancialNeed, Need
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.utils.timezone import now
from django.db.models import Q
from django.utils.dateparse import parse_date





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

            # Redirection en fonction du rôle
            if user.role == "volunteer":
                return redirect('scheduleVolunteer')
            else:
                return redirect('create_event')

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

        if not username or not email or not phone or not password or not birth_date:
            return render(request, 'sign_up_volunteer.html', {'error': "Tous les champs sont requis.", 'skills': Skill.objects.all()})

        if password != password2:
            return render(request, 'sign_up_volunteer.html', {'error': "Les mots de passe ne correspondent pas.", 'skills': Skill.objects.all()})

        try:
            user = CustomUser.objects.create_user(
                username=username, email=email, telephone=phone, password=password, role='volunteer'
            )
            volunteer = Volunteer.objects.create(user=user, birthDate=birth_date)

            # Ajouter les compétences sélectionnées
            for skill_id in selected_skills:
                skill = Skill.objects.get(id=skill_id)
                volunteer.skills.add(skill)

            login(request, user)
            return redirect('scheduleVolunteer')

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

@csrf_exempt
def filter_needs(request, category):
    current_time = now()
    today = current_time.date()
    
    volunteer = request.user.volunteer
    needs = volunteer.needs.all()

    if category == "Past Contributions":
        past_needs = needs.filter(date__lt=today)
        past_human_needs = needs.filter(type="human", date=today, human_need__endTime__lt=current_time.time())
        needsRendered = past_needs | past_human_needs

    elif category == "Next Contributions":
        future_needs = needs.filter(date__gte=today)
        future_human_needs = needs.filter(type="human", date=today, human_need__endTime__gte=current_time.time())
        needsRendered = future_needs | future_human_needs

    return render(request, "needPartial.html", {"needs": needsRendered, "category": category, "volunteer": volunteer})

    
@csrf_exempt    
def filterNeedExplore(request, category):
    current_time = now()
    today = current_time.date()
    
    valid_needs = Need.objects.filter(date__gte=today)  # Get all future needs
    
    unfulfilled_human_needs = Need.objects.filter(
        type="human",
        date=today,
        human_need__endTime__gte=current_time.time(),  # Only ongoing human needs
        human_need__volunteersCount__lt=models.F("human_need__requiredPeople")
    )
    
    unfulfilled_material_needs = Need.objects.filter(
        type="material",
        material_need__itemCount__lt=F("material_need__requiredQuantity"),
        date__gte=today
    )
    
    unfulfilled_financial_needs = Need.objects.filter(
        type="financial",
        date__gte=today,
        financial_need__amountCollected__lt=F("financial_need__requiredAmount")
    )
    
    if category == "Organizational assistance":
        needsFiltered = unfulfilled_human_needs
    elif category == "Financial Support":
        needsFiltered = unfulfilled_financial_needs
    elif category == "Financial Support":
        needs_filtered = unfulfilled_material_needs
    else:
        needsFiltered = valid_needs
    
    return render(request, "needPartial.html", {"needs": needsFiltered, "category": category, "volunteer": request.user.volunteer})

@csrf_exempt
def join_need(request, need_id):
    user = request.user  
    need = get_object_or_404(Need, id=need_id)

    # Get the volunteer object
    volunteer, created = Volunteer.objects.get_or_create(user=user)

    # Check if the user has already joined this need
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

        need.material_need.itemCount += 1
        need.material_need.save()
        need.volunteers.add(volunteer)

    elif need.type == "financial":
        if need.financial_need.amountCollected >= need.financial_need.amountRequired:
            return JsonResponse({"error": "Donation goal already reached!"}, status=400)

        amount_donated = request.POST.get("amount", 0)
        try:
            amount_donated = float(amount_donated)
        except ValueError:
            return JsonResponse({"error": "Invalid amount"}, status=400)

        if amount_donated <= 0:
            return JsonResponse({"error": "Donation amount must be positive"}, status=400)

        need.financial_need.amountCollected += amount_donated
        need.financial_need.save()

        # Update volunteer's money contribution
        volunteer.moneyVolunteered += amount_donated
        volunteer.save()

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
        organisation = Organisation.objects.first()

        # Convert date strings to date objects
        date_start = parse_date(date_start) if date_start else None
        date_end = parse_date(date_end) if date_end else None

        event = Event.objects.create(
            eventName=event_name,
            description=description,
            dateStart=date_start,  # Déjà parsé
            dateEnd=date_end,  # Déjà parsé
            organisation=organisation
        )

        
        # Handling multiple needs
        need_titles = request.POST.getlist("need_title")
        need_descriptions = request.POST.getlist("need_description")
        need_types = request.POST.getlist("need_type")
        
        for i in range(len(need_titles)):
            need = Need.objects.create(
                title=need_titles[i],
                description=need_descriptions[i],
                type=need_types[i],
                organisation=organisation
            )
            
            if need_types[i] == "human":
                required_people = int(request.POST.getlist("required_people")[i])
                skill_id = request.POST.getlist("skill")[i]
                skill = Skill.objects.get(id=skill_id) if skill_id else None
                start_time = request.POST.getlist("start_time")[i]
                end_time = request.POST.getlist("end_time")[i]
                HumanNeed.objects.create(need=need, requiredPeople=required_people, skill=skill, startTime=start_time, endTime=end_time)
            
            elif need_types[i] == "material":
                item_name = request.POST.getlist("item_name")[i]
                required_quantity = int(request.POST.getlist("required_quantity")[i])
                MaterialNeed.objects.create(need=need, itemName=item_name, requiredQuantity=required_quantity)
                
            elif need_types[i] == "financial":
                amount_required = float(request.POST.getlist("amount_required")[i])
                FinancialNeed.objects.create(need=need, amountRequired=amount_required)
        
        return redirect("event_list")
    
    skills = Skill.objects.all()
    return render(request, "addEvent.html", {"skills": skills})

@csrf_exempt
def event_list(request):
    events = Event.objects.all()
    return render(request, 'event_list.html', {'events': events})
    

@csrf_exempt
def dashboard_orga(request):
    return JsonResponse(data)


@csrf_exempt
def calculate_event_progress(event):
    return round(overall_progress, 2)

@csrf_exempt
def dashboard_opportunies(request):
    return JsonResponse({"events": event_data})


from django.contrib.auth import authenticate, login, get_user_model
from django.shortcuts import render, redirect
from django.db import IntegrityError
from django.views.decorators.csrf import csrf_exempt
import logging
from .models import CustomUser, Volunteer, Skill


logger = logging.getLogger(__name__)
CustomUser = get_user_model()  # Utiliser le modèle utilisateur personnalisé


@csrf_exempt
def sign_in(request):
    if request.method == "POST":
        try:
            identifier = request.POST.get('identifier')  # Peut être email, username ou téléphone
            password = request.POST.get('password')

            if not identifier or not password:
                return render(request, 'signIn.html', {'error': "Identifiant et mot de passe requis."})

            # Vérifier avec username, email ou téléphone
            user = CustomUser.objects.filter(username=identifier).first() or \
                   CustomUser.objects.filter(email=identifier).first() or \
                   CustomUser.objects.filter(telephone=identifier).first()

            if user and user.check_password(password):
                login(request, user)
                return redirect('dashboard')  # Redirection après connexion

            return render(request, 'signIn.html', {'error': "Identifiants incorrects."})

        except Exception as e:
            logger.error(f"Erreur lors de la connexion : {str(e)}")
            return render(request, 'signIn.html', {'error': "Une erreur s'est produite."})

    return render(request, 'signIn.html')


@csrf_exempt
def sign_up_organisation(request):
    if request.method == "POST":
        username = request.POST.get('username')
        email = request.POST.get('email')
        telephone = request.POST.get('telephone')
        password = request.POST.get('password')
        password2 = request.POST.get('password2')
        role = "organisation"

        

        if password != password2:
            return render(request, 'sign_up_organisation.html', {'error': "Les mots de passe ne correspondent pas."})
            

        try:
            user = CustomUser.objects.create_user(
                username=username, email=email, telephone=telephone, password=password, role=role
            )
            organisation = Organisation.objects.create(
                     user=user,
                    )
            login(request, user)  # Connexion automatique après inscription
                     
            return redirect('organisationHomepage')

        except IntegrityError:
            return render(request, 'sign_up_organisation.html', {'error': "Nom d'utilisateur, email ou téléphone déjà utilisé."})
        except Exception as e:
            logger.error(f"Erreur lors de l'inscription : {str(e)}")
            return render(request, 'sign_up_organisation.html', {'error': "Une erreur s'est produite."})

    return render(request, 'sign_up_organisation.html')


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
            return redirect('volunteer_dashboard')

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


def home(request):
    return render(request, 'home.html') 
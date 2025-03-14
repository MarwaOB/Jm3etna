from django.urls import path
from . import views

urlpatterns = [
 path('', views.home, name='home'),  
 path('sign_in', views.sign_in, name='sign_in'),
 path('sign_up_organisation', views.sign_up_organisation, name='sign_up_organisation'),
  path('sign_up_volunteer', views.sign_up_volunteer, name='sign_up_volunteer'),   

path('organisationHomepage', views.organisationHomepage, name='organisationHomepage'),   
path('volunteerHomepage', views.volunteerHomepage, name='volunteerHomepage'),  


path('auth/org' , views.dashboard_orga , name='Dashboard-organisation'),



]
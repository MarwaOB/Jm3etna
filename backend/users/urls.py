from django.urls import path
from . import views
from .views import create_event


urlpatterns = [
path('', views.home, name='home'),  
path('sign_in', views.sign_in, name='sign_in'),
path('sign_up_organisation', views.sign_up_organisation, name='sign_up_organisation'),
path('sign_up_volunteer', views.sign_up_volunteer, name='sign_up_volunteer'),   
path('organisationHomepage', views.organisationHomepage, name='organisationHomepage'),   
path('volunteerHomepage', views.volunteerHomepage, name='volunteerHomepage'),   
path("scheduleVolunteer", views.scheduleVolunteer, name="scheduleVolunteer"),
path("contributeVolunteer", views.contributeVolunteer, name="contributeVolunteer"),
path('needs/<str:category>/', views.filter_needs, name='filter_needs'),
path('needs/<str:category>/', views.filterNeedExplore, name='filterNeedExplore'),
path("join-need/<int:need_id>/", views.join_need, name="join_need"),
path('create_event/', create_event, name='create_event'),
path('event_list', views.event_list, name='event_list'),

path('auth/org' , views.dashboard_orga , name='Dashboard-organisation'),
path('auth/org/opportunities' , views.dashboard_opportunies , name='Dashboard-organisation-opportunities'),


]
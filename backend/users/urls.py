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
path('needs/filter/<str:category>/', views.filter_needs, name='filter_needs'),
path('needs/explore/<str:category>/', views.filterNeedExplore, name='filterNeedExplore'),
path("join-need/<int:need_id>/", views.join_need, name="join_need"),
path('create_event/', create_event, name='create_event'),
path('event_list', views.event_list, name='event_list'),
path('auth/org' , views.dashboard_orga , name='Dashboard-organisation'),
path('auth/org/opportunities' , views.dashboard_opportunities , name='Dashboard-organisation-opportunities'),
path('addEventPage', views.addEventPage, name='addEventPage'),
path('auth/org/listVolunteers', views.listVolunteers, name='listVolunteers'),
path('auth/org/listVolunteers/<int:volunteer_id>', views.getVolunteerProfile, name='volunteerProfile'),
  path('forum_view/', views.forum_view, name='forum_view'),
    path('send_message/', views.send_message, name='send_message'),
        path('get_messages/', views.get_messages, name='get_messages'),  # ✅ Add this line

]
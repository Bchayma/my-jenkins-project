# smart_campus_navigation/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # path('generate-response/', views.generate_response, name='generate_response'),
    path('', views.home, name='home'),
    path('api/ask', views.ask_bot,name='ask_bot'),
    path('get-location-info', views.get_location_info, name='get_location_info'),
        # Nouvelle route pour ajouter un objet perdu
    path('lost-and-found', views.add_lost_item, name='add_lost_item'),

    # Nouvelle route pour trouver des correspondances d'objets
    path('matches/<int:lost_id>', views.find_matches, name='find_matches'),
]


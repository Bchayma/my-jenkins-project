

from django.contrib import admin
from .models import LostItem, FoundItem

# Enregistrer les modèles dans l'interface d'administration
admin.site.register(LostItem)
admin.site.register(FoundItem)

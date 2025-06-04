from django.db import models



class LostItem(models.Model):
    description = models.TextField()  # Description de l'objet
    location = models.CharField(max_length=255)  # Lieu de la perte
    date_lost = models.DateField()  # Date de la perte
    created_at = models.DateTimeField(auto_now_add=True)  # Date de création de l'objet perdu

    def __str__(self):
        return f"Lost Item: {self.description}"

class FoundItem(models.Model):
    description = models.TextField()  # Description de l'objet trouvé
    location = models.CharField(max_length=255)  # Lieu de la trouvaille
    date_found = models.DateField()  # Date de la trouvaille
    created_at = models.DateTimeField(auto_now_add=True)  # Date de création de l'objet trouvé

    def __str__(self):
        return f"Found Item: {self.description}"
from django.db import models

# class LostItem(models.Model):
#     description = models.TextField()
#     location = models.CharField(max_length=255)
#     date_lost = models.DateField()
#     created_at = models.DateTimeField(auto_now_add=True)

# class FoundItem(models.Model):
#     description = models.TextField()
#     location = models.CharField(max_length=255)
#     date_found = models.DateField()
#     created_at = models.DateTimeField(auto_now_add=True)



class LostAndFound(models.Model):
    STATUS_CHOICES = [
        ('lost', 'Perdu'),
        ('found', 'Trouvé'),
    ]

    name = models.CharField(max_length=255)  # Nom de l'objet (ex : téléphone, sac)
    description = models.TextField()  # Description détaillée de l'objet
    category = models.CharField(max_length=100)  # Catégorie de l'objet (ex : électronique, vêtements)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)  # Statut (perdu/trouvé)
    location = models.CharField(max_length=255, null=True, blank=True)  # Lieu où l'objet a été perdu/trouvé
    contact_info = models.CharField(max_length=255)  # Informations pour récupérer l'objet (ex : numéro de téléphone)
    created_at = models.DateTimeField(auto_now_add=True)  # Date de création (automatiquement renseignée)
    
    def __str__(self):
        return f"{self.name} - {self.status}"


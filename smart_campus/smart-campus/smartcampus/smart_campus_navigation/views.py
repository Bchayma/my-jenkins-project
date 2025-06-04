# smart_campus_navigation/views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import requests
# smartcampus/views.py
import xml.etree.ElementTree as ET
from django.shortcuts import render
from .models import LostItem, FoundItem

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from django.http import JsonResponse
from .models import LostItem, FoundItem


def home(request):
    return JsonResponse({"message": "Bienvenue sur l'API Smart Campus 🎓"})

OLLAMA_API_URL = "http://localhost:11434/api/generate"

@csrf_exempt
def ask_bot(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            prompt = data.get("prompt")

            ollama_response = requests.post(OLLAMA_API_URL, json={
                "model": "mistral:latest",
                "prompt": f"CAMPUS_NAV_PROMPT: {prompt}",
                "stream": False
            })

            if ollama_response.status_code == 200:
                answer = ollama_response.json().get("response", "Pas de réponse")
                return JsonResponse({"response": answer})
            else:
                return JsonResponse({"response": "Erreur depuis Ollama"}, status=500)
        except Exception as e:
            return JsonResponse({"response": f"Erreur serveur Django: {str(e)}"}, status=500)

    return JsonResponse({"response": "Méthode non autorisée"}, status=405)


# Charger et analyser le fichier XML OpenStreetMap
def load_osm_data():
    # Chemin du fichier OSM dans le dossier data/
    tree = ET.parse('smart_campus_navigation/data/openstreetmap.xml')  # Assurez-vous que le fichier est dans le bon répertoire
    root = tree.getroot()

    nodes = []
    for node in root.findall('node'):
        node_id = node.get('id')
        lat = float(node.get('lat'))
        lon = float(node.get('lon'))
        # On récupère également les tags (comme "name" si disponible)
        tags = {tag.get('k'): tag.get('v') for tag in node.findall('tag')}
        nodes.append({
            'id': node_id,
            'lat': lat,
            'lon': lon,
            'tags': tags  # Tags peuvent inclure des informations comme "name", "building", etc.
        })

    return nodes

# Vue pour obtenir les informations de localisation basées sur une requête
def get_location_info(request):
    query = request.GET.get('query', '').lower()  # Requête de l'utilisateur
    nodes = load_osm_data()

    for node in nodes:
        # Rechercher un tag "name" ou d'autres tags en fonction de la requête
        if 'name' in node['tags'] and query in node['tags']['name'].lower():
            return JsonResponse({
                'message': f"Localisation trouvée : {node['tags']['name']} à la latitude {node['lat']} et longitude {node['lon']}."
            })

    return JsonResponse({'message': "Désolé, je n'ai pas trouvé de correspondance pour votre requête."})


@csrf_exempt
def add_lost_item(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            description = data.get("description")
            location = data.get("location")
            date_lost = data.get("date_lost")

            if not all([description, location, date_lost]):
                return JsonResponse({"message": "Tous les champs sont requis"}, status=400)

            lost_item = LostItem(description=description, location=location, date_lost=date_lost)
            lost_item.save()

            return JsonResponse({"message": "Objet perdu ajouté avec succès", "id": lost_item.id})
        except Exception as e:
            return JsonResponse({"message": f"Erreur serveur: {str(e)}"}, status=500)

    return JsonResponse({"message": "Méthode non autorisée"}, status=405)





def compare_descriptions(lost_desc, found_desc):
    corpus = [lost_desc, found_desc]  # Liste contenant les deux descriptions
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(corpus)  # Transformation TF-IDF

    similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
    return similarity[0][0]  # Score entre 0 et 1




def find_matches(request, lost_id):
    try:
        lost_item = LostItem.objects.get(id=lost_id)
        found_items = FoundItem.objects.all()

        results = []
        for found in found_items:
            score = compare_descriptions(lost_item.description, found.description)
            if score > 0.7:  # seuil de similarité (vous pouvez l’ajuster)
                results.append({
                    "description": found.description,
                    "location": found.location,
                    "date_found": found.date_found,
                    "similarity": round(score, 2)
                })

        return JsonResponse(results, safe=False)
    
    except LostItem.DoesNotExist:
        return JsonResponse({"error": "Objet perdu introuvable"}, status=404)

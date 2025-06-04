'use client';

import { useState } from 'react';
import Navbar from '../../components/Navrbar';

export default function LostAndFoundPage() {
  const [itemDescription, setItemDescription] = useState('');
  const [location, setLocation] = useState('');
  const [dateLost, setDateLost] = useState('');
  const [foundItems, setFoundItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchFoundItems = () => {
    const filteredItems = foundItems.filter(item =>
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFoundItems(filteredItems);
  };

  const handleSubmitLostItem = async () => {
    if (!itemDescription || !location || !dateLost) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const response = await fetch('http://localhost:8000/lost-and-found', {
      method: 'POST',
      body: JSON.stringify({
        description: itemDescription,
        location,
        date_lost: dateLost
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    const responseText = await response.text();
    console.log('Réponse brute :', responseText);

    try {
      const result = JSON.parse(responseText);
      if (response.ok) {
        alert('Objet perdu soumis avec succès');
        const matchesResponse = await fetch(`/api/matches/${result.id}`);
        const matchesText = await matchesResponse.text();
        console.log('Réponse matches brute :', matchesText);
        const matches = JSON.parse(matchesText);
        setFoundItems(matches);
      } else {
        alert('Erreur lors de la soumission');
      }
    } catch (error) {
      console.error('Erreur de parsing JSON :', error);
      alert('Erreur lors du parsing de la réponse.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white text-black">
      <Navbar />

      {/* Titre principal */}
      <div className="text-center mt-10 mb-8 px-4">
        <h2 className="text-4xl font-bold text-blue-800">🎒 Lost & Found</h2>
        <p className="text-gray-600">Déclare un objet perdu ou explore les objets trouvés.</p>
      </div>

      {/* Section deux colonnes */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        
        {/* Formulaire "Signaler" */}
        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-5 hover:shadow-2xl transition-all">
          <h3 className="text-2xl font-semibold text-blue-700">📍 Signaler un objet perdu</h3>
          <input
            type="text"
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
            placeholder="Description de l'objet"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Lieu de la perte"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="date"
            value={dateLost}
            onChange={(e) => setDateLost(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSubmitLostItem}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition"
          >
            Soumettre
          </button>
        </div>

        {/* Recherche objets trouvés */}
        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-5 hover:shadow-2xl transition-all">
          <h3 className="text-2xl font-semibold text-blue-700">🔍 Objets trouvés</h3>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Recherche par description"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSearchFoundItems}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition"
          >
            Rechercher
          </button>

          {/* Résultats */}
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            {foundItems.length === 0 ? (
              <p className="text-gray-500 text-sm">Aucun objet trouvé pour cette recherche.</p>
            ) : (
              foundItems.map((item, index) => (
                <div key={index} className="p-4 bg-blue-50 border border-blue-100 rounded-xl shadow-sm">
                  <p><span className="font-medium">Description :</span> {item.description}</p>
                  <p><span className="font-medium">Lieu :</span> {item.location}</p>
                  <p><span className="font-medium">Date trouvée :</span> {item.dateFound}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <footer className="text-center text-gray-400 text-sm pb-6">© 2025 Smart Campus Assistant</footer>
    </div>
  );
}

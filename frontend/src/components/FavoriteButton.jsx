import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function FavoriteButton({ entityType, entityId, entityName }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id && entityId) {
      checkIfFavorite();
    }
  }, [user, entityId]);

  const checkIfFavorite = async () => {
    try {
      const response = await fetch(`http://localhost:8000/favorites/user/${user.id}`);
      if (!response.ok) return;
      
      const favorites = await response.json();
      const existingFavorite = favorites.find(
        f => f.entity_type === entityType && String(f.entity_id) === String(entityId)
      );
      
      if (existingFavorite) {
        setIsFavorite(true);
        setFavoriteId(existingFavorite.id);
      }
    } catch (error) {
      console.error("Error checking favorite:", error);
    }
  };

  const toggleFavorite = async () => {
    if (!user?.id) {
      console.error("Usuario no disponible:", user);
      alert("Debes iniciar sesión para añadir favoritos");
      return;
    }

    console.log("Toggle favorite con user.id:", user.id);
    setLoading(true);

    try {
      if (isFavorite && favoriteId) {
        // Remove from favorites
        const response = await fetch(`http://localhost:8000/favorites/${favoriteId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setIsFavorite(false);
          setFavoriteId(null);
        }
      } else {
        // Add to favorites
        const response = await fetch('http://localhost:8000/favorites/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user.id,
            entity_type: entityType,
            entity_id: String(entityId),
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setIsFavorite(true);
          setFavoriteId(data.id);
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("Error al actualizar favoritos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
        isFavorite
          ? 'bg-yellow-500 text-white hover:bg-yellow-600'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
    >
      <svg
        className="w-6 h-6"
        fill={isFavorite ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
      {isFavorite ? 'Favorito' : 'Añadir a favoritos'}
    </button>
  );
}

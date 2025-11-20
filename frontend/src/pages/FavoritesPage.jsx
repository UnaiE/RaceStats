import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [enrichedFavorites, setEnrichedFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (favorites.length > 0) {
      console.log('Favoritos a enriquecer:', favorites);
      enrichFavorites();
    } else if (favorites.length === 0 && !loading) {
      // Si no hay favoritos, no necesitamos enriquecer
      setEnrichedFavorites([]);
    }
  }, [favorites]);

  const fetchFavorites = async () => {
    try {
      const response = await fetch(`http://localhost:8000/favorites/user/${user.id}`);
      if (!response.ok) throw new Error("Error al cargar favoritos");
      const data = await response.json();
      setFavorites(data);
      
      // Si no hay favoritos, establecer loading a false aquí
      if (data.length === 0) {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const enrichFavorites = async () => {
    try {
      const enriched = await Promise.all(
        favorites.map(async (fav) => {
          try {
            // Mapeo de tipos a endpoints
            const endpointMap = {
              'driver': 'drivers',
              'team': 'teams',
              'car': 'cars',
              'race': 'races',
              'circuit': 'circuits'
            };
            
            const endpoint = endpointMap[fav.entity_type];
            if (!endpoint) {
              console.warn(`Tipo desconocido: ${fav.entity_type}`);
              return { ...fav, data: null };
            }

            const response = await fetch(`http://localhost:8000/${endpoint}/`);
            if (!response.ok) {
              console.error(`Error fetching ${endpoint}:`, response.status);
              return { ...fav, data: null };
            }
            
            const allData = await response.json();
            
            // Buscar el elemento específico con múltiples estrategias
            let itemData = null;
            
            // Estrategia 1: Buscar por los campos de ID más comunes
            itemData = allData.find(item => {
              const possibleIds = [
                item._id,
                item.driver_id, 
                item.team_id, 
                item.car_id, 
                item.race_id,
                item.session_key, // Para races
                item.circuit_id,
                item.circuit_key, // Para circuits
                item.car_number // Para cars
              ].filter(Boolean); // Eliminar undefined/null
              
              return possibleIds.some(id => String(id) === String(fav.entity_id));
            });
            
            if (!itemData) {
              console.warn(`No se encontró ${fav.entity_type} con ID ${fav.entity_id}`);
            }
            
            return { ...fav, data: itemData };
          } catch (err) {
            console.error(`Error enriching ${fav.entity_type}:`, err);
            return { ...fav, data: null };
          }
        })
      );
      
      console.log('Favoritos enriquecidos:', enriched);
      setEnrichedFavorites(enriched.filter(f => f.data !== null));
    } catch (error) {
      console.error("Error enriching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId) => {
    try {
      const response = await fetch(`http://localhost:8000/favorites/${favoriteId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setFavorites(favorites.filter(f => f.id !== favoriteId));
        setEnrichedFavorites(enrichedFavorites.filter(f => f.id !== favoriteId));
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const filteredFavorites = activeFilter === 'all' 
    ? enrichedFavorites 
    : enrichedFavorites.filter(f => f.entity_type === activeFilter);

  const getFavoriteIcon = (type) => {
    const icons = {
      'driver': '👤',
      'team': '🏎️',
      'car': '🚗',
      'race': '🏁',
      'circuit': '🛣️'
    };
    return icons[type] || '⭐';
  };

  const navigateToDetail = (favorite) => {
    const routes = {
      'driver': `/drivers/${favorite.entity_id}`,
      'team': `/teams/${favorite.entity_id}`,
      'car': `/cars/${favorite.entity_id}`,
      'race': `/races/${favorite.entity_id}`,
      'circuit': `/circuits/${favorite.entity_id}`
    };
    navigate(routes[favorite.entity_type]);
  };

  const getEntityName = (favorite) => {
    if (!favorite.data) {
      console.log('Sin datos para:', favorite);
      return 'Sin datos';
    }
    
    const { data, entity_type } = favorite;
    
    switch(entity_type) {
      case 'driver':
        return data.full_name || `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'Piloto sin nombre';
      case 'team':
        return data.team_name || data.name || 'Equipo sin nombre';
      case 'car':
        const carName = data.model_name || `${data.team_name || ''} ${data.year || ''}`.trim();
        return carName || 'Coche sin nombre';
      case 'race':
        return data.meeting_name || data.race_name || data.name || data.location || 'Carrera sin nombre';
      case 'circuit':
        return data.name || data.circuit_short_name || 'Circuito sin nombre';
      default:
        return 'Elemento';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando favoritos...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Debes iniciar sesión para ver tus favoritos</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al Dashboard
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <span>⭐</span>
            Mis Favoritos
          </h1>
          <p className="text-gray-600 mt-2">
            Gestiona tus pilotos, equipos y circuitos favoritos
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {['all', 'driver', 'team', 'car', 'race', 'circuit'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeFilter === filter
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {filter === 'all' ? '📋 Todos' : `${getFavoriteIcon(filter)} ${filter.charAt(0).toUpperCase() + filter.slice(1)}s`}
            </button>
          ))}
        </div>

        {/* Favorites Grid */}
        {filteredFavorites.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">⭐</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No tienes favoritos aún
            </h3>
            <p className="text-gray-600 mb-6">
              Marca elementos como favoritos desde sus páginas de detalle
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Explorar contenido
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFavorites.map((favorite) => (
              <div
                key={favorite.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{getFavoriteIcon(favorite.entity_type)}</div>
                    <button
                      onClick={() => removeFavorite(favorite.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Eliminar de favoritos"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {getEntityName(favorite)}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4 capitalize">
                    {favorite.entity_type === 'driver' ? 'Piloto' :
                     favorite.entity_type === 'team' ? 'Equipo' :
                     favorite.entity_type === 'car' ? 'Coche' :
                     favorite.entity_type === 'race' ? 'Carrera' :
                     favorite.entity_type === 'circuit' ? 'Circuito' : favorite.entity_type}
                  </p>
                  
                  <button
                    onClick={() => navigateToDetail(favorite)}
                    className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                  >
                    Ver detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

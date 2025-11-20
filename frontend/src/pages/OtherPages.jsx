import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const createListPage = (config) => {
  return function ListPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
      fetch(`http://localhost:8000/${config.endpoint}/`)
        .then((res) => res.json())
        .then((data) => {
          // Filtrar y procesar datos según configuración
          let processedData = data;
          
          if (config.filterData) {
            processedData = config.filterData(data);
          }
          
          setItems(processedData);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, []);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <header className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver
              </button>
              <div className="flex items-center gap-2">
                <span className="text-3xl">{config.icon}</span>
                <h1 className="text-2xl font-bold text-gray-800">{config.title}</h1>
              </div>
              <div className="text-sm text-gray-600">{items.length} {config.title.toLowerCase()}</div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <div
                key={item[config.idField] || index}
                onClick={() => config.onCardClick && config.onCardClick(item, navigate)}
                className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-6 ${
                  config.onCardClick ? 'cursor-pointer hover:scale-105 transform' : ''
                }`}
              >
                {config.renderCard(item)}
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  };
};

// Circuits Page
export const CircuitsPage = createListPage({
  title: "Circuitos",
  icon: "🛣️",
  endpoint: "circuits",
  idField: "circuit_key",
  onCardClick: (circuit, navigate) => {
    navigate(`/circuits/${circuit.circuit_key || circuit.circuit_id}`);
  },
  renderCard: (circuit) => (
    <>
      {/* Imagen del circuito */}
      <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
        {circuit.layout_image ? (
          <img
            src={circuit.layout_image}
            alt={circuit.name || circuit.circuit_short_name}
            className="w-full h-full object-contain p-2"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<span class="text-6xl opacity-20">🏁</span>';
            }}
          />
        ) : (
          <span className="text-6xl opacity-20">🏁</span>
        )}
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">
        {circuit.name || circuit.circuit_short_name || "Circuito"}
      </h3>
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
        <span>📍</span>
        <span>{circuit.location || circuit.country}</span>
      </div>
      {circuit.country_code && (
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
          <img
            src={`https://flagcdn.com/w20/${circuit.country_code.toLowerCase()}.png`}
            alt={circuit.country}
            className="h-3 w-auto rounded shadow-sm"
          />
          <span>{circuit.country}</span>
        </div>
      )}
    </>
  ),
});

// Seasons Page
export const SeasonsPage = createListPage({
  title: "Temporadas",
  icon: "📅",
  endpoint: "seasons",
  idField: "year",
  filterData: (data) => {
    // Filtrar duplicados y los que tienen 0 carreras
    const validSeasons = data.filter(s => s.race_count > 0);
    
    // Agrupar por año y tomar el que tenga más carreras
    const seasonsByYear = {};
    validSeasons.forEach(season => {
      const year = String(season.year);
      if (!seasonsByYear[year] || seasonsByYear[year].race_count < season.race_count) {
        seasonsByYear[year] = season;
      }
    });
    
    // Convertir a array y ordenar por año descendente
    return Object.values(seasonsByYear).sort((a, b) => 
      parseInt(String(b.year)) - parseInt(String(a.year))
    );
  },
  onCardClick: (season, navigate) => {
    navigate(`/seasons/${season.year}`);
  },
  renderCard: (season) => (
    <>
      <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-3">
        {season.year}
      </div>
      <div className="flex items-center gap-2 text-gray-700 mb-2">
        <span className="text-xl">🏁</span>
        <span className="text-lg font-semibold">{season.race_count} carreras</span>
      </div>
      {season.start_date && (
        <p className="text-xs text-gray-500 mt-2">
          Inicio: {new Date(season.start_date).toLocaleDateString("es-ES")}
        </p>
      )}
    </>
  ),
});

// Championships Page
export const ChampionshipsPage = createListPage({
  title: "Campeonatos",
  icon: "🏆",
  endpoint: "championships",
  idField: "year",
  onCardClick: (championship, navigate) => {
    navigate(`/championships/${championship.year || championship.championship_id || championship._id}`);
  },
  renderCard: (championship) => (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-gray-800">
          {championship.year}
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          championship.status === 'completed' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-blue-100 text-blue-800'
        }`}>
          {championship.status === 'completed' ? 'Completado' : 'En Progreso'}
        </span>
      </div>
      
      <p className="text-sm font-semibold text-gray-700 mb-3">
        {championship.name || `Formula 1 World Championship ${championship.year}`}
      </p>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>🏁</span>
          <span>{championship.completed_races || 0}/{championship.total_races || 0} Carreras</span>
        </div>
        
        {championship.champion_driver && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>👤</span>
            <span className="font-semibold text-yellow-600">{championship.champion_driver}</span>
          </div>
        )}
        
        {championship.champion_constructor && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>🏎️</span>
            <span className="font-semibold text-yellow-600">{championship.champion_constructor}</span>
          </div>
        )}
      </div>
      
      {championship.driver_standings && championship.driver_standings.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            {championship.driver_standings.length} pilotos • {championship.constructor_standings?.length || 0} equipos
          </p>
        </div>
      )}
    </>
  ),
});

// Cars Page
export const CarsPage = createListPage({
  title: "Coches",
  icon: "🏎️",
  endpoint: "cars",
  idField: "car_id",
  onCardClick: (car, navigate) => {
    navigate(`/cars/${car.car_id}`);
  },
  renderCard: (car) => {
    // Debug: verificar que el coche tenga datos
    if (!car.team_name && !car.model_name) {
      console.warn('Coche sin nombre:', car);
    }
    
    return (
    <>
      {/* Imagen del coche */}
      <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
        <img
          src={car.image_url || ''}
          alt={car.model_name || car.team_name}
          className="w-full h-full object-contain p-2 car-image"
          style={{ display: car.image_url ? 'block' : 'none' }}
          onError={(e) => {
            e.target.style.display = 'none';
            const fallback = e.target.parentElement.querySelector('.fallback-icon');
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        <div className="fallback-icon absolute inset-0 flex items-center justify-center" style={{display: car.image_url ? 'none' : 'flex'}}>
          <span className="text-6xl opacity-20">🏎️</span>
        </div>
      </div>
      
      {/* Barra de color del equipo */}
      <div
        className="w-full h-2 rounded-lg mb-3"
        style={{ backgroundColor: car.team_colour || "#3B82F6" }}
      />
      
      {/* Nombre del modelo */}
      <h3 className="text-xl font-bold text-gray-800 mb-1">
        {car.model_name || car.team_name}
      </h3>
      
      {/* Equipo */}
      <p className="text-sm text-gray-700 font-semibold mb-2">
        {car.team_name}
      </p>
      
      {/* Año */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
        <span>📅</span>
        <span>Temporada {car.year}</span>
      </div>
      
      {/* Motor */}
      {car.engine && (
        <div className="text-xs text-gray-500 mt-2 border-t border-gray-200 pt-2">
          <span className="font-semibold">Motor:</span> {car.engine}
        </div>
      )}
      
      {/* Logros */}
      {car.achievements && car.achievements.length > 0 && (
        <div className="mt-2">
          <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
            🏆 {car.achievements.length} logros
          </span>
        </div>
      )}
    </>
  );
  }
});

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
        <img
          src={`https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/${circuit.circuit_short_name?.toLowerCase().replace(/ /g, '_')}_circuit.png`}
          alt={circuit.circuit_short_name}
          className="w-full h-full object-cover opacity-70"
          onError={(e) => {
            e.target.parentElement.innerHTML = '<span class="text-6xl opacity-20">🏁</span>';
          }}
        />
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">
        {circuit.circuit_short_name || circuit.circuit_name || "Circuito"}
      </h3>
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
        <span>📍</span>
        <span>{circuit.location || circuit.country_name}</span>
      </div>
      {circuit.country_code && (
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
          <img
            src={`https://flagcdn.com/w20/${circuit.country_code?.toLowerCase()}.png`}
            alt={circuit.country_code}
            className="h-3 w-auto rounded shadow-sm"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <span>{circuit.country_name || circuit.country_code}</span>
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
  idField: "championship_id",
  onCardClick: (championship, navigate) => {
    navigate(`/championships/${championship.championship_id}`);
  },
  renderCard: (championship) => (
    <>
      <h3 className="text-lg font-bold text-gray-800 mb-2">
        {championship.name || `Campeonato ${championship.year}`}
      </h3>
      <p className="text-sm text-gray-600">📅 Año: {championship.year}</p>
      {championship.seasons_count && (
        <p className="text-xs text-gray-500 mt-2">
          {championship.seasons_count} temporadas
        </p>
      )}
    </>
  ),
});

// Cars Page
export const CarsPage = createListPage({
  title: "Coches",
  icon: "🚗",
  endpoint: "cars",
  idField: "car_id",
  onCardClick: (car, navigate) => {
    navigate(`/cars/${car.car_id || car.car_number}`);
  },
  renderCard: (car) => (
    <>
      <div
        className="w-full h-2 rounded-lg mb-4"
        style={{ backgroundColor: car.team_colour || "#3B82F6" }}
      />
      <h3 className="text-lg font-bold text-gray-800 mb-2">
        {car.team_name || car.constructor_id}
      </h3>
      <p className="text-sm text-gray-600">📅 Temporada: {car.year}</p>
      {car.nationality && (
        <p className="text-xs text-gray-500 mt-2">🌍 {car.nationality}</p>
      )}
    </>
  ),
});

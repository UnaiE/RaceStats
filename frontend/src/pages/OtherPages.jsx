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
          setItems(data);
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
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6"
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
  renderCard: (circuit) => (
    <>
      <h3 className="text-lg font-bold text-gray-800 mb-2">
        {circuit.circuit_short_name || circuit.circuit_name || "Circuito"}
      </h3>
      <p className="text-sm text-gray-600">
        📍 {circuit.location || circuit.country}
      </p>
      {circuit.circuit_key && (
        <p className="text-xs text-gray-500 mt-2">ID: {circuit.circuit_key}</p>
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
  renderCard: (season) => (
    <>
      <div className="text-4xl font-bold text-blue-600 mb-2">{season.year}</div>
      <p className="text-sm text-gray-600">
        🏁 {season.race_count || 0} carreras
      </p>
      {season.start_date && (
        <p className="text-xs text-gray-500 mt-2">
          Inicio: {new Date(season.start_date).toLocaleDateString()}
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

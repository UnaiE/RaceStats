import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RacesPage() {
  const [races, setRaces] = useState([]);
  const [filteredRaces, setFilteredRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/races/")
      .then((res) => res.json())
      .then((data) => {
        setRaces(data);
        setFilteredRaces(data);
        setLoading(false);
      });
  }, []);

  // Filtrar carreras cuando cambian los filtros
  useEffect(() => {
    let filtered = races;

    // Filtro por búsqueda de texto
    if (searchTerm) {
      filtered = filtered.filter((race) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          (race.meeting_name || race.race_name || "").toLowerCase().includes(searchLower) ||
          (race.location || "").toLowerCase().includes(searchLower) ||
          (race.circuit_short_name || "").toLowerCase().includes(searchLower) ||
          (race.country_name || "").toLowerCase().includes(searchLower)
        );
      });
    }

    // Filtro por año
    if (selectedYear !== "all") {
      filtered = filtered.filter((race) => race.year === parseInt(selectedYear));
    }

    // Filtro por país
    if (selectedCountry !== "all") {
      filtered = filtered.filter((race) => race.country_code === selectedCountry);
    }

    setFilteredRaces(filtered);
  }, [searchTerm, selectedYear, selectedCountry, races]);

  // Obtener años únicos para el filtro
  const availableYears = [...new Set(races.map((race) => race.year))].sort((a, b) => b - a);

  // Obtener países únicos para el filtro
  const availableCountries = [...new Set(races.map((race) => race.country_code).filter(Boolean))]
    .sort()
    .map((code) => {
      const race = races.find((r) => r.country_code === code);
      return { code, name: race?.country_name || code };
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
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
              <span className="text-3xl">🏁</span>
              <h1 className="text-2xl font-bold text-gray-800">Carreras</h1>
            </div>
            <div className="text-sm text-gray-600">{filteredRaces.length} de {races.length}</div>
          </div>

          {/* Barra de búsqueda y filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Búsqueda por texto */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar carrera, ubicación, país..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Filtro por año */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
            >
              <option value="all">Todos los años</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {/* Filtro por país */}
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
            >
              <option value="all">Todos los países</option>
              {availableCountries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {filteredRaces.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No se encontraron carreras con los filtros seleccionados</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedYear("all");
                setSelectedCountry("all");
              }}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredRaces.map((race) => (
            <div
              key={race.race_id || race.session_key}
              onClick={() => navigate(`/races/${race.session_key || race.race_id}`)}
              className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105 group"
            >
              {/* Banner superior con año */}
              <div className="h-2 bg-gradient-to-r from-red-600 to-red-800" />
              
              <div className="p-5">
                {/* Título y año */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-base font-bold text-gray-900 leading-tight flex-1 group-hover:text-red-600 transition-colors">
                    {race.meeting_name || race.race_name || "Carrera"}
                  </h3>
                  <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full font-bold ml-2 flex-shrink-0">
                    {race.year}
                  </span>
                </div>

                {/* Ubicación con bandera */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-lg">📍</span>
                    <span className="font-semibold">{race.location || race.circuit_short_name}</span>
                  </div>
                  
                  {race.country_code && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <img
                        src={`https://flagcdn.com/w20/${race.country_code.toLowerCase()}.png`}
                        alt={race.country_code}
                        className="h-4 w-auto rounded shadow-sm"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                      <span>{race.country_name || race.country_code}</span>
                    </div>
                  )}
                </div>

                {/* Fecha */}
                {race.date_start && (
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <span>🗓️</span>
                      {new Date(race.date_start).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        )}
      </main>
    </div>
  );
}

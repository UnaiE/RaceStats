import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RacesPage() {
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/races/")
      .then((res) => res.json())
      .then((data) => {
        setRaces(data);
        setLoading(false);
      });
  }, []);

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
              <span className="text-3xl">🏁</span>
              <h1 className="text-2xl font-bold text-gray-800">Carreras</h1>
            </div>
            <div className="text-sm text-gray-600">{races.length} carreras</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {races.map((race) => (
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
      </main>
    </div>
  );
}

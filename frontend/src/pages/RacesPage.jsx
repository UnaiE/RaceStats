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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {races.map((race) => (
            <div
              key={race.race_id || race.session_key}
              onClick={() => navigate(`/races/${race.session_key || race.race_id}`)}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer transform hover:scale-105"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-800">
                  {race.meeting_name || race.race_name || "Carrera"}
                </h3>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-semibold">
                  {race.year}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                📍 {race.location || race.circuit_short_name || "Ubicación"}
              </p>
              <p className="text-xs text-gray-500 mb-3">
                {race.country_name || race.country_code}
              </p>
              {race.date_start && (
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(race.date_start).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

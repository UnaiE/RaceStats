import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/teams/")
      .then((res) => res.json())
      .then((data) => {
        setTeams(data);
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
              <span className="text-3xl">🏎️</span>
              <h1 className="text-2xl font-bold text-gray-800">Equipos</h1>
            </div>
            <div className="text-sm text-gray-600">{teams.length} equipos</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div
              key={team.team_id || team.team_name}
              onClick={() => navigate(`/teams/${team.team_id || encodeURIComponent(team.team_name || team.name)}`)}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer transform hover:scale-105"
            >
              <div
                className="w-full h-3 rounded-t-lg mb-4"
                style={{ backgroundColor: team.colour || team.team_colour || "#3B82F6" }}
              />
              
              {/* Logo del equipo */}
              {team.logo && (
                <div className="flex justify-center mb-4">
                  <img
                    src={team.logo}
                    alt={`${team.name || team.team_name} logo`}
                    className="h-16 object-contain"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
              
              <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                {team.name || team.team_name}
              </h3>
              <p className="text-gray-600 text-sm text-center">
                {team.country || team.nationality || "País no especificado"}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

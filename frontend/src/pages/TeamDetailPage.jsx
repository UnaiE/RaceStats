import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function TeamDetailPage() {
  const [team, setTeam] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { teamId } = useParams();

  useEffect(() => {
    fetchTeamDetails();
  }, [teamId]);

  const fetchTeamDetails = async () => {
    try {
      // Obtener todos los equipos
      const teamsResponse = await fetch("http://localhost:8000/teams/");
      if (!teamsResponse.ok) throw new Error("Error al cargar equipo");
      const teamsData = await teamsResponse.json();
      
      // Buscar el equipo específico
      const foundTeam = teamsData.find(
        (t) => String(t.team_id) === teamId || 
               encodeURIComponent(t.team_name || t.name) === teamId ||
               (t.team_name || t.name) === decodeURIComponent(teamId)
      );
      
      if (!foundTeam) {
        throw new Error("Equipo no encontrado");
      }
      
      setTeam(foundTeam);

      // Obtener pilotos del equipo
      const driversResponse = await fetch("http://localhost:8000/drivers/");
      if (driversResponse.ok) {
        const driversData = await driversResponse.json();
        const teamDrivers = driversData.filter(
          (d) => d.team_name === (foundTeam.team_name || foundTeam.name)
        );
        setDrivers(teamDrivers);
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información del equipo...</p>
        </div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-xl">❌ {error || "Equipo no encontrado"}</p>
          <button
            onClick={() => navigate("/teams")}
            className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Volver a Equipos
          </button>
        </div>
      </div>
    );
  }

  const teamColor = team.colour || team.team_colour || "#1f2937";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate("/teams")}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Volver a Equipos
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Hero Section with Team Logo */}
          <div
            className="relative h-64 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${teamColor}dd, ${teamColor})`,
            }}
          >
            <div className="text-center text-white z-10">
              {team.logo && (
                <img
                  src={team.logo}
                  alt={`${team.name || team.team_name} logo`}
                  className="h-32 mx-auto mb-4 drop-shadow-2xl"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
              <h1 className="text-5xl font-bold mb-2 drop-shadow-lg">
                {team.name || team.team_name}
              </h1>
              <p className="text-2xl opacity-90">
                {team.country || team.nationality || ""}
              </p>
            </div>
            
            {/* Decorative stripe */}
            <div
              className="absolute bottom-0 left-0 right-0 h-2"
              style={{ backgroundColor: teamColor }}
            />
          </div>

          {/* Team Details Grid */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Información del Equipo
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Team Name */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 font-semibold mb-1">
                  Nombre del Equipo
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {team.name || team.team_name}
                </p>
              </div>

              {/* Country */}
              {(team.country || team.nationality) && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 font-semibold mb-1">
                    País
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {team.country || team.nationality}
                  </p>
                </div>
              )}

              {/* Team Colour */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 font-semibold mb-1">
                  Color del Equipo
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-16 h-16 rounded-lg shadow-md border-2 border-white"
                    style={{ backgroundColor: teamColor }}
                  ></div>
                  <p className="text-sm font-mono text-gray-700">
                    {teamColor}
                  </p>
                </div>
              </div>

              {/* Session Key */}
              {team.session_key && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 font-semibold mb-1">
                    Session Key
                  </p>
                  <p className="text-lg font-mono text-gray-900">
                    {team.session_key}
                  </p>
                </div>
              )}

              {/* Meeting Key */}
              {team.meeting_key && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 font-semibold mb-1">
                    Meeting Key
                  </p>
                  <p className="text-lg font-mono text-gray-900">
                    {team.meeting_key}
                  </p>
                </div>
              )}

              {/* Team ID */}
              {team.team_id && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 font-semibold mb-1">
                    Team ID
                  </p>
                  <p className="text-lg font-mono text-gray-900">
                    {team.team_id}
                  </p>
                </div>
              )}
            </div>

            {/* Drivers Section */}
            {drivers.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Pilotos del Equipo ({drivers.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {drivers.map((driver) => (
                    <div
                      key={driver.driver_id || driver.driver_number}
                      onClick={() => navigate(`/drivers/${driver.driver_number || driver.driver_id}`)}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-all cursor-pointer transform hover:scale-105"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-md"
                          style={{ backgroundColor: teamColor }}
                        >
                          {driver.driver_number || "?"}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900">
                            {driver.full_name || driver.name_acronym}
                          </p>
                          <p className="text-sm text-gray-600">
                            {driver.name_acronym}
                          </p>
                        </div>
                        {driver.headshot_url && (
                          <img
                            src={driver.headshot_url}
                            alt={driver.full_name}
                            className="w-16 h-16 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Logo Gallery */}
            {team.logo && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Logo del Equipo
                </h2>
                <div className="bg-gray-50 rounded-lg p-8 border border-gray-200 flex justify-center">
                  <img
                    src={team.logo}
                    alt={`${team.name || team.team_name} logo`}
                    className="h-48 object-contain"
                    onError={(e) => {
                      e.target.parentElement.innerHTML = '<p class="text-gray-500">Logo no disponible</p>';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

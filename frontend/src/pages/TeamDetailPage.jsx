import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TeamNews from "../components/TeamNews";
import ImageGallery from "../components/ImageGallery";

export default function TeamDetailPage() {
  const [team, setTeam] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [enrichedData, setEnrichedData] = useState(null);
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
      
      console.log('Team data:', foundTeam); // Debug
      console.log('Team news:', foundTeam.news); // Debug

      // Obtener pilotos del equipo
      const driversResponse = await fetch("http://localhost:8000/drivers/");
      if (driversResponse.ok) {
        const driversData = await driversResponse.json();
        const teamDrivers = driversData.filter(
          (d) => d.team_name === (foundTeam.team_name || foundTeam.name)
        );
        setDrivers(teamDrivers);
      }

      // Obtener datos enriquecidos del equipo
      if (foundTeam.achievements || foundTeam.images_gallery) {
        setEnrichedData({
          achievements: foundTeam.achievements || [],
          images: foundTeam.images_gallery || []
        });
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
            onClick={() => navigate(-1)}
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
              <div className="flex items-center justify-center gap-3">
                {team.country_code && (
                  <img
                    src={`https://flagcdn.com/w80/${team.country_code.toLowerCase()}.png`}
                    alt={`${team.country_code} flag`}
                    className="h-8 rounded shadow-lg"
                  />
                )}
                <p className="text-2xl opacity-90">
                  {team.country_code ? team.country_code.toUpperCase() : (team.country || team.nationality || "")}
                </p>
              </div>
            </div>
            
            {/* Decorative stripe */}
            <div
              className="absolute bottom-0 left-0 right-0 h-2"
              style={{ backgroundColor: teamColor }}
            />
          </div>

          {/* Team Details Grid */}
          <div className="p-8">
            {/* Championships Stats */}
            {(team.constructors_championships || team.drivers_championships || team.founded_year) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg p-6 text-white shadow-lg">
                  <p className="text-sm opacity-90 mb-1">🏆 Campeonatos de Constructores</p>
                  <p className="text-4xl font-bold">{team.constructors_championships || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg p-6 text-white shadow-lg">
                  <p className="text-sm opacity-90 mb-1">👤 Campeonatos de Pilotos</p>
                  <p className="text-4xl font-bold">{team.drivers_championships || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-lg p-6 text-white shadow-lg">
                  <p className="text-sm opacity-90 mb-1">📅 Año de Fundación</p>
                  <p className="text-4xl font-bold">{team.founded_year || "N/A"}</p>
                </div>
              </div>
            )}

            {/* History Section */}
            {team.history && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  📖 Historia del Equipo
                </h2>
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <p className="text-gray-700 leading-relaxed text-justify">
                    {team.history}
                  </p>
                </div>
              </div>
            )}

            {/* Sponsors Section */}
            {team.sponsors && team.sponsors.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  💼 Patrocinadores Principales
                </h2>
                <div className="flex flex-wrap gap-3">
                  {team.sponsors.map((sponsor, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg px-4 py-2 border-2 border-gray-200 shadow-sm font-semibold text-gray-700"
                    >
                      {sponsor}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Legendary Drivers Section */}
            {team.legendary_drivers && team.legendary_drivers.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  ⭐ Pilotos Legendarios
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {team.legendary_drivers.map((driver, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200 shadow-sm"
                    >
                      <p className="font-bold text-gray-900 text-lg">{driver}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Current Drivers Section */}
            {drivers.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  🏎️ Pilotos Actuales ({drivers.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {drivers.map((driver) => (
                    <div
                      key={driver.driver_id || driver.driver_number}
                      onClick={() => navigate(`/drivers/${driver.driver_id || driver.driver_number}`)}
                      className="bg-white rounded-lg p-6 border-2 hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
                      style={{ borderColor: teamColor }}
                    >
                      <div className="flex items-center gap-4">
                        {driver.headshot_url ? (
                          <img
                            src={driver.headshot_url}
                            alt={driver.full_name}
                            className="w-20 h-20 object-cover rounded-full border-4"
                            style={{ borderColor: teamColor }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-20 h-20 rounded-full flex items-center justify-center font-bold text-white text-2xl shadow-md ${driver.headshot_url ? 'hidden' : ''}`}
                          style={{ backgroundColor: teamColor }}
                        >
                          {driver.driver_id || driver.driver_number || "?"}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 text-xl">
                            {driver.full_name || driver.name_acronym}
                          </p>
                          <p className="text-sm text-gray-600 font-semibold">
                            {driver.name_acronym}
                          </p>
                          {driver.country_code && (
                            <div className="flex items-center gap-2 mt-2">
                              <img
                                src={`https://flagcdn.com/w40/${driver.country_code.toLowerCase()}.png`}
                                alt={driver.country_code}
                                className="h-4 rounded shadow"
                              />
                              <span className="text-xs text-gray-500">
                                {driver.country_code.toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-white text-xl shadow-lg"
                          style={{ backgroundColor: teamColor }}
                        >
                          #{driver.driver_id || driver.driver_number || "?"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Logo Gallery */}
            {team.logo && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  🎨 Logo del Equipo
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

            {/* Team News */}
            {team.news && team.news.length > 0 && (
              <div className="mt-8">
                <TeamNews news={team.news} />
              </div>
            )}

            {/* Team Achievements */}
            {team.achievements && team.achievements.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>🏆</span>
                  Logros y Campeonatos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {team.achievements.map((achievement, index) => (
                    <div key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 p-4 rounded">
                      <p className="text-gray-800">{achievement}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Image Gallery */}
            {team.images_gallery && team.images_gallery.length > 0 && (
              <ImageGallery images={team.images_gallery} title="Galería del Equipo" />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageGallery from "../components/ImageGallery";

export default function DriverDetailPage() {
  const [driver, setDriver] = useState(null);
  const [stats, setStats] = useState(null);
  const [enrichedData, setEnrichedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { driverId } = useParams();

  useEffect(() => {
    fetchDriverDetails();
  }, [driverId]);

  const fetchDriverDetails = async () => {
    try {
      // Obtener información básica del piloto
      const response = await fetch("http://localhost:8000/drivers/");
      if (!response.ok) throw new Error("Error al cargar piloto");
      const data = await response.json();
      
      // Buscar el piloto por driver_id
      const foundDriver = data.find(
        (d) => String(d.driver_id) === driverId
      );
      
      if (!foundDriver) {
        throw new Error("Piloto no encontrado");
      }
      
      setDriver(foundDriver);
      
      // Los datos enriquecidos ya están en el objeto del piloto
      if (foundDriver.news || foundDriver.images_gallery || foundDriver.career_highlights) {
        setEnrichedData({
          news: foundDriver.news || [],
          images: foundDriver.images_gallery || [],
          career_highlights: foundDriver.career_highlights || [],
          stats: foundDriver.stats_scraped || {}
        });
      }
      
      // Obtener estadísticas completas
      try {
        const statsResponse = await fetch(`http://localhost:8000/drivers/${foundDriver.driver_id}/stats`);
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }
      } catch (err) {
        console.warn("No se pudieron cargar las estadísticas completas:", err);
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
          <p className="mt-4 text-gray-600">Cargando información del piloto...</p>
        </div>
      </div>
    );
  }

  if (error || !driver) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-xl">❌ {error || "Piloto no encontrado"}</p>
          <button
            onClick={() => navigate("/drivers")}
            className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Volver a Pilotos
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
            Volver a Pilotos
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Hero Section with Driver Photo */}
          <div
            className="relative h-64 bg-gradient-to-r from-gray-800 to-gray-900"
            style={{
              background: driver.team_colour
                ? `linear-gradient(135deg, ${driver.team_colour}dd, ${driver.team_colour})`
                : "linear-gradient(135deg, #1f2937, #111827)",
            }}
          >
            <div className="absolute inset-0 flex items-end justify-between p-8">
              <div className="text-white">
                <div className="flex items-center gap-4 mb-2">
                  <div
                    className="bg-white text-gray-900 w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl shadow-lg"
                  >
                    {driver.driver_id || "?"}
                  </div>
                  {driver.country_code && (
                    <img
                      src={`https://flagcdn.com/w80/${driver.country_code.toLowerCase()}.png`}
                      alt={driver.country_code}
                      className="h-12 w-auto rounded shadow-lg"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  )}
                </div>
                <h1 className="text-4xl font-bold mb-2">
                  {driver.full_name || "Sin nombre"}
                </h1>
                <p className="text-xl opacity-90">
                  {driver.team_name || "Sin equipo"}
                </p>
              </div>
              {driver.headshot_url && (
                <img
                  src={driver.headshot_url}
                  alt={driver.full_name}
                  className="h-64 object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
            </div>
          </div>

          {/* Career Statistics Section */}
          {stats && (
            <div className="p-8 bg-gray-50 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                📊 Estadísticas de Carrera
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {/* Age */}
                {stats.age && (
                  <div className="bg-white rounded-lg p-4 border-2 border-gray-200 text-center">
                    <p className="text-sm text-gray-600 font-semibold mb-1">
                      🎂 Edad
                    </p>
                    <p className="text-3xl font-bold text-red-600">
                      {stats.age}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">años</p>
                  </div>
                )}

                {/* Championships */}
                <div className="bg-white rounded-lg p-4 border-2 border-yellow-400 text-center">
                  <p className="text-sm text-gray-600 font-semibold mb-1">
                    🏆 Campeonatos
                  </p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {stats.championships || 0}
                  </p>
                </div>

                {/* Wins */}
                <div className="bg-white rounded-lg p-4 border-2 border-green-400 text-center">
                  <p className="text-sm text-gray-600 font-semibold mb-1">
                    🏁 Victorias
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {stats.wins || 0}
                  </p>
                </div>

                {/* Poles */}
                <div className="bg-white rounded-lg p-4 border-2 border-purple-400 text-center">
                  <p className="text-sm text-gray-600 font-semibold mb-1">
                    ⚡ Poles
                  </p>
                  <p className="text-3xl font-bold text-purple-600">
                    {stats.poles || 0}
                  </p>
                </div>

                {/* Podiums */}
                <div className="bg-white rounded-lg p-4 border-2 border-blue-400 text-center">
                  <p className="text-sm text-gray-600 font-semibold mb-1">
                    🥇 Podios
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {stats.podiums || 0}
                  </p>
                </div>

                {/* Total Races */}
                {stats.career_races && (
                  <div className="bg-white rounded-lg p-4 border-2 border-gray-300 text-center">
                    <p className="text-sm text-gray-600 font-semibold mb-1">
                      🏎️ Carreras
                    </p>
                    <p className="text-3xl font-bold text-gray-700">
                      {stats.career_races}
                    </p>
                  </div>
                )}

                {/* Fastest Laps */}
                {stats.career_fastest_laps > 0 && (
                  <div className="bg-white rounded-lg p-4 border-2 border-red-400 text-center">
                    <p className="text-sm text-gray-600 font-semibold mb-1">
                      ⏱️ V. Rápidas
                    </p>
                    <p className="text-3xl font-bold text-red-600">
                      {stats.career_fastest_laps}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Biography Section */}
          {(stats?.biography || driver.biography) && (
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                📖 Biografía
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {stats?.biography || driver.biography}
              </p>
            </div>
          )}

          {/* Interesting Facts Section */}
          {(stats?.interesting_facts || driver.interesting_facts) && (
            <div className="p-8 bg-gray-50 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                💡 Datos Curiosos
              </h2>
              <ul className="space-y-2">
                {(stats?.interesting_facts || driver.interesting_facts).map((fact, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-red-600 text-xl">•</span>
                    <span className="text-gray-700">{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Driver Details Grid */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              ℹ️ Información del Piloto
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Driver Number */}
              {driver.driver_id && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 font-semibold mb-1">
                    Número
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    #{driver.driver_id}
                  </p>
                </div>
              )}

              {/* Name Acronym */}
              {driver.name_acronym && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 font-semibold mb-1">
                    Acrónimo
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {driver.name_acronym}
                  </p>
                </div>
              )}

              {/* Team Name */}
              {driver.team_name && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 font-semibold mb-1">
                    Equipo
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {driver.team_name}
                  </p>
                </div>
              )}

              {/* Country */}
              {driver.country_code && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 font-semibold mb-1">
                    Nacionalidad
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://flagcdn.com/w40/${driver.country_code.toLowerCase()}.png`}
                      alt={driver.country_code}
                      className="h-6 w-auto rounded shadow"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <p className="text-lg font-bold text-gray-900">
                      {driver.country_code}
                    </p>
                  </div>
                </div>
              )}

              {/* Full Name */}
              {driver.full_name && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 md:col-span-2">
                  <p className="text-sm text-gray-600 font-semibold mb-1">
                    Nombre Completo
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {driver.full_name}
                  </p>
                </div>
              )}

              {/* Team Colour */}
              {driver.team_colour && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 font-semibold mb-1">
                    Color del Equipo
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-lg shadow-md border-2 border-white"
                      style={{ backgroundColor: driver.team_colour }}
                    ></div>
                    <p className="text-sm font-mono text-gray-700">
                      {driver.team_colour}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Driver News */}
            {enrichedData && enrichedData.news && enrichedData.news.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>📰</span>
                  Noticias Recientes
                </h3>
                <div className="space-y-4">
                  {enrichedData.news.map((item, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2 hover:bg-gray-50 transition-colors bg-white rounded-r-lg">
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <h4 className="font-semibold text-gray-900 hover:text-blue-600">
                          {item.title}
                        </h4>
                        {item.description && (
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        )}
                        <div className="flex gap-4 text-xs text-gray-400 mt-2">
                          <span>{item.source}</span>
                          <span>{new Date(item.date).toLocaleDateString('es-ES')}</span>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Career Highlights */}
            {enrichedData && enrichedData.career_highlights && enrichedData.career_highlights.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>🏆</span>
                  Logros de Carrera
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {enrichedData.career_highlights.slice(0, 6).map((highlight, index) => (
                    <div key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 p-4 rounded">
                      <p className="text-gray-800 text-sm">{highlight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Image Gallery */}
            {enrichedData && enrichedData.images && enrichedData.images.length > 0 && (
              <div className="mt-8">
                <ImageGallery images={enrichedData.images} title="Galería del Piloto" />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

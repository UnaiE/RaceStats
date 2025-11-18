import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function RaceDetailPage() {
  const [race, setRace] = useState(null);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { raceId } = useParams();

  useEffect(() => {
    fetchRaceDetails();
  }, [raceId]);

  const fetchRaceDetails = async () => {
    try {
      // Obtener todas las carreras y buscar la específica
      const response = await fetch("http://localhost:8000/races/");
      if (!response.ok) throw new Error("Error al cargar carrera");
      const data = await response.json();
      
      const foundRace = data.find(
        (r) => String(r.session_key) === raceId || String(r.race_id) === raceId
      );
      
      if (!foundRace) {
        throw new Error("Carrera no encontrada");
      }
      
      setRace(foundRace);

      // Usar resultados de la base de datos si existen
      if (foundRace.race_results && foundRace.race_results.length > 0) {
        console.log(`✅ Resultados cargados desde BD: ${foundRace.race_results.length} pilotos`);
        setStandings(foundRace.race_results);
      } else {
        // Intentar obtener desde Ergast como fallback
        if (foundRace.year && foundRace.round) {
          console.log(`🔍 Buscando resultados en Ergast: ${foundRace.year}/round/${foundRace.round}`);
          await fetchRaceResults(foundRace.year, foundRace.round);
        }
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRaceResults = async (year, round) => {
    try {
      const response = await fetch(
        `https://ergast.com/api/f1/${year}/${round}/results.json`
      );
      
      if (response.ok) {
        const data = await response.json();
        const results = data.MRData?.RaceTable?.Races?.[0]?.Results || [];
        
        if (results.length > 0) {
          setStandings(results);
          console.log(`✅ Resultados obtenidos desde Ergast: ${results.length} pilotos`);
        } else {
          console.log(`⚠️ Ergast no tiene resultados para ${year}/round/${round} (carrera futura o sprint)`);
        }
      }
    } catch (error) {
      console.log("⚠️ Error al conectar con Ergast API:", error);
    }
  };

  const fetchRaceResultsByLocation = async (year, location) => {
    try {
      const response = await fetch(
        `https://ergast.com/api/f1/${year}/results.json?limit=1000`
      );
      
      if (response.ok) {
        const data = await response.json();
        const races = data.MRData?.RaceTable?.Races || [];
        
        const matchingRace = races.find(r => 
          r.Circuit?.Location?.locality?.toLowerCase().includes(location.toLowerCase()) ||
          location.toLowerCase().includes(r.Circuit?.Location?.locality?.toLowerCase())
        );

        if (matchingRace) {
          setStandings(matchingRace.Results || []);
          console.log("✅ Resultados obtenidos por ubicación");
        }
      }
    } catch (error) {
      console.log("⚠️ No se pudieron obtener resultados");
    }
  };

  const formatTime = (time) => {
    if (!time) return "-";
    return time;
  };

  const getPositionColor = (position) => {
    switch (parseInt(position)) {
      case 1: return "bg-yellow-100 border-yellow-400 text-yellow-900";
      case 2: return "bg-gray-100 border-gray-400 text-gray-900";
      case 3: return "bg-orange-100 border-orange-400 text-orange-900";
      default: return "bg-white border-gray-200 text-gray-900";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información de la carrera...</p>
        </div>
      </div>
    );
  }

  if (error || !race) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-xl">❌ {error || "Carrera no encontrada"}</p>
          <button
            onClick={() => navigate("/races")}
            className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Volver a Carreras
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
            onClick={() => navigate("/races")}
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
            Volver a Carreras
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Hero Section */}
          <div className="relative h-48 bg-gradient-to-r from-red-600 to-red-800 flex items-center justify-center">
            <div className="text-center text-white z-10">
              <h1 className="text-5xl font-bold mb-2">
                {race.meeting_name || "Gran Premio"}
              </h1>
              <p className="text-2xl opacity-90">
                📍 {race.location || race.circuit_short_name}
              </p>
              <p className="text-lg opacity-75 mt-2">
                {race.country_name} • {race.year}
              </p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-red-900" />
          </div>

          {/* Race Info Grid */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Información de la Carrera
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {race.date_start && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 font-semibold mb-1">Fecha</p>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(race.date_start).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              )}

              {race.circuit_short_name && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 font-semibold mb-1">Circuito</p>
                  <p className="text-lg font-bold text-gray-900">
                    {race.circuit_short_name}
                  </p>
                </div>
              )}

              {race.session_name && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 font-semibold mb-1">Sesión</p>
                  <p className="text-lg font-bold text-gray-900">
                    {race.session_name}
                  </p>
                </div>
              )}

              {race.round && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 font-semibold mb-1">Ronda</p>
                  <p className="text-lg font-bold text-gray-900">
                    #{race.round}
                  </p>
                </div>
              )}
            </div>

            {/* Race Results / Standing */}
            {standings.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>🏆</span>
                  Clasificación Final
                </h2>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-900 text-white">
                        <th className="px-4 py-3 text-left text-sm font-semibold">Pos</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Piloto</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Equipo</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Puntos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {standings.map((result, index) => {
                        // Detectar si es resultado de OpenF1 (BD) o Ergast
                        const isOpenF1Result = result.driver_name !== undefined;
                        
                        return (
                          <tr
                            key={index}
                            className={`border-b border-gray-200 hover:bg-gray-50 ${
                              index < 3 ? getPositionColor(result.position) : ""
                            }`}
                          >
                            <td className="px-4 py-3">
                              <div className={`font-bold text-lg ${
                                parseInt(result.position) <= 3 ? "text-2xl" : ""
                              }`}>
                                {result.position}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                {isOpenF1Result && result.headshot_url && (
                                  <img
                                    src={result.headshot_url}
                                    alt={result.driver_name}
                                    className="w-10 h-10 rounded-full object-cover"
                                    onError={(e) => e.target.style.display = 'none'}
                                  />
                                )}
                                <div>
                                  <div className="font-semibold text-gray-900">
                                    {isOpenF1Result 
                                      ? result.driver_name 
                                      : `${result.Driver?.givenName} ${result.Driver?.familyName}`}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {isOpenF1Result 
                                      ? `#${result.driver_number} • ${result.driver_acronym}`
                                      : `#${result.number} • ${result.Driver?.code}`}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                {isOpenF1Result && result.team_colour && (
                                  <div 
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: `#${result.team_colour}` }}
                                  />
                                )}
                                <span className="text-gray-700">
                                  {isOpenF1Result 
                                    ? result.team_name 
                                    : result.Constructor?.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {result.points !== undefined && (
                                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                  {result.points}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Fastest Lap - solo si viene de Ergast */}
                {standings.find(r => r.FastestLap?.rank === "1") && (
                  <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                      <span>⚡</span>
                      Vuelta Más Rápida
                    </h3>
                    {(() => {
                      const fastest = standings.find(r => r.FastestLap?.rank === "1");
                      return (
                        <p className="text-purple-800">
                          <span className="font-semibold">
                            {fastest.Driver?.givenName} {fastest.Driver?.familyName}
                          </span>
                          {" - "}
                          <span className="font-mono">{fastest.FastestLap?.Time?.time}</span>
                          {fastest.FastestLap?.AverageSpeed?.speed && (
                            <>
                              {" - "}
                              <span>{fastest.FastestLap.AverageSpeed.speed} km/h</span>
                            </>
                          )}
                        </p>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {standings.length === 0 && (
              <div className="mt-8">
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <p className="text-gray-500 text-lg mb-2">
                    📊 No hay resultados disponibles para esta carrera
                  </p>
                  <p className="text-gray-400 text-sm">
                    {race.year >= 2025 
                      ? "Esta carrera aún no se ha disputado" 
                      : "Los resultados no están disponibles en Ergast API"}
                  </p>
                </div>

                {/* Información adicional cuando no hay resultados */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Información del circuito */}
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span>🏁</span>
                      Información del Circuito
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Nombre del Circuito</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {race.circuit_short_name || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Ubicación</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {race.location}, {race.country_name}
                        </p>
                      </div>
                      {race.country_code && (
                        <div className="flex items-center gap-2 pt-2">
                          <img
                            src={`https://flagcdn.com/w80/${race.country_code.toLowerCase()}.png`}
                            alt={race.country_code}
                            className="h-10 rounded shadow"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Detalles de la sesión */}
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span>📋</span>
                      Detalles de la Sesión
                    </h3>
                    <div className="space-y-3">
                      {race.session_type && (
                        <div>
                          <p className="text-sm text-gray-600">Tipo de Sesión</p>
                          <p className="text-lg font-semibold text-gray-900">{race.session_type}</p>
                        </div>
                      )}
                      {race.date_start && (
                        <div>
                          <p className="text-sm text-gray-600">Fecha y Hora</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {new Date(race.date_start).toLocaleString("es-ES", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      )}
                      {race.gmt_offset && (
                        <div>
                          <p className="text-sm text-gray-600">Zona Horaria</p>
                          <p className="text-lg font-semibold text-gray-900">GMT {race.gmt_offset}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Estadísticas adicionales si están disponibles */}
                {(race.total_laps || race.race_distance) && (
                  <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                      <span>📊</span>
                      Estadísticas de la Carrera
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {race.total_laps && (
                        <div className="text-center">
                          <p className="text-sm text-blue-700">Vueltas Totales</p>
                          <p className="text-2xl font-bold text-blue-900">{race.total_laps}</p>
                        </div>
                      )}
                      {race.race_distance && (
                        <div className="text-center">
                          <p className="text-sm text-blue-700">Distancia</p>
                          <p className="text-2xl font-bold text-blue-900">{race.race_distance}</p>
                        </div>
                      )}
                      {race.safety_car_deployments !== undefined && (
                        <div className="text-center">
                          <p className="text-sm text-blue-700">Safety Cars</p>
                          <p className="text-2xl font-bold text-blue-900">{race.safety_car_deployments}</p>
                        </div>
                      )}
                      {race.virtual_safety_car !== undefined && (
                        <div className="text-center">
                          <p className="text-sm text-blue-700">VSC</p>
                          <p className="text-2xl font-bold text-blue-900">{race.virtual_safety_car}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

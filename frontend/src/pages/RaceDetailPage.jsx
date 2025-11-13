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

      // Intentar obtener resultados desde Ergast API
      // Prioridad 1: Si tiene year y round
      if (foundRace.year && foundRace.round) {
        console.log(`🔍 Buscando resultados: ${foundRace.year}/round/${foundRace.round}`);
        await fetchRaceResults(foundRace.year, foundRace.round);
      } 
      // Prioridad 2: Si solo tiene year, intentar búsqueda por ubicación
      else if (foundRace.year && foundRace.location) {
        console.log(`🔍 Buscando resultados por ubicación: ${foundRace.year}/${foundRace.location}`);
        await fetchRaceResultsByLocation(foundRace.year, foundRace.location);
      }
      else {
        console.log("⚠️ No se puede buscar resultados: faltan year o round");
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
                        <th className="px-4 py-3 text-left text-sm font-semibold">Tiempo</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Puntos</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {standings.map((result, index) => (
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
                            <div className="font-semibold text-gray-900">
                              {result.Driver?.givenName} {result.Driver?.familyName}
                            </div>
                            <div className="text-sm text-gray-600">
                              #{result.number} • {result.Driver?.code}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {result.Constructor?.name}
                          </td>
                          <td className="px-4 py-3 font-mono text-sm">
                            {result.Time?.time || formatTime(result.Time)}
                          </td>
                          <td className="px-4 py-3">
                            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                              {result.points}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded ${
                              result.status === "Finished" 
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}>
                              {result.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Fastest Lap */}
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
                          {" - "}
                          <span>{fastest.FastestLap?.AverageSpeed?.speed} km/h</span>
                        </p>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {standings.length === 0 && (
              <div className="mt-8 text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500 text-lg">
                  📊 No hay resultados disponibles para esta carrera
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Los resultados se obtienen automáticamente de Ergast API
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

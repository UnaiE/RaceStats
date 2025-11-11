import React, { useState, useEffect } from "react";
import { useCountdown } from "../hooks/useCountdown";

export default function RaceCountdown() {
  const [nextRace, setNextRace] = useState(null);
  const [lastPodium, setLastPodium] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seasonProgress, setSeasonProgress] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNextRace();
  }, []);

  const fetchNextRace = async () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    try {
      // Intentar obtener desde OpenF1 API directamente (más confiable)
      const openF1Url = `https://api.openf1.org/v1/meetings?year=${currentYear}`;
      
      try {
        const openF1Response = await fetch(openF1Url);
        
        if (openF1Response.ok) {
          const meetings = await openF1Response.json();
          
          // Filtrar reuniones futuras y obtener las carreras
          const futureMeetings = meetings
            .filter(meeting => {
              const meetingDate = new Date(meeting.date_start);
              return meetingDate > now;
            })
            .sort((a, b) => new Date(a.date_start) - new Date(b.date_start));
          
          if (futureMeetings.length > 0) {
            const nextMeeting = futureMeetings[0];
            
            // Buscar la sesión de carrera de esta reunión
            const sessionsUrl = `https://api.openf1.org/v1/sessions?meeting_key=${nextMeeting.meeting_key}&session_name=Race`;
            const sessionsResponse = await fetch(sessionsUrl);
            
            if (sessionsResponse.ok) {
              const sessions = await sessionsResponse.json();
              if (sessions.length > 0) {
                const raceSession = sessions[0];
                
                setNextRace({
                  meeting_name: nextMeeting.meeting_name,
                  location: nextMeeting.location,
                  country_name: nextMeeting.country_name,
                  circuit_short_name: nextMeeting.circuit_short_name,
                  session_name: "Race",
                  date_start: raceSession.date_start,
                  year: nextMeeting.year,
                  meeting_key: nextMeeting.meeting_key,
                  session_key: raceSession.session_key
                });
                
                console.log("✅ Próxima carrera desde OpenF1 API:", nextMeeting.meeting_name);
                
                // Calcular progreso de temporada
                const totalMeetings = meetings.filter(m => m.year === currentYear).length;
                const completedMeetings = meetings.filter(m => {
                  return m.year === currentYear && new Date(m.date_start) < now;
                }).length;
                
                const progress = (completedMeetings / totalMeetings) * 100;
                setSeasonProgress(Math.round(progress));
                
                // Obtener podio real
                await fetchRealPodium(raceSession);
                
                setLoading(false);
                return;
              }
            }
          }
        }
      } catch (openF1Error) {
        console.log("⚠️ OpenF1 API no disponible, usando base de datos local:", openF1Error.message);
      }
      
      // Fallback: usar nuestra base de datos MongoDB
      console.log("📦 Obteniendo datos desde base de datos local");
      const response = await fetch("http://localhost:8000/races/");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const races = await response.json();
      console.log("Total de carreras obtenidas:", races.length);

      // Filtrar carreras futuras (date_start > ahora)
      const futureRaces = races
        .filter((race) => {
          if (!race.date_start) return false;
          const raceDate = new Date(race.date_start);
          return raceDate > now;
        })
        .sort((a, b) => new Date(a.date_start) - new Date(b.date_start));

      if (futureRaces.length > 0) {
        // Hay carreras futuras, usar la más próxima
        setNextRace(futureRaces[0]);
        console.log("✅ Próxima carrera:", futureRaces[0]);
      } else {
        // No hay carreras futuras, usar la más reciente (última del año)
        const pastRaces = races
          .filter((race) => race.date_start)
          .sort((a, b) => new Date(b.date_start) - new Date(a.date_start));
        
        if (pastRaces.length > 0) {
          setNextRace(pastRaces[0]);
          console.log("⚠️ Última carrera (no hay futuras):", pastRaces[0]);
        } else {
          console.log("❌ No hay carreras disponibles");
          setError("No hay carreras disponibles");
        }
      }

      // Calcular progreso de temporada basado en carreras completadas
      const racesThisYear = races.filter((race) => race.year === currentYear);
      const completedRaces = racesThisYear.filter(
        (race) => race.date_start && new Date(race.date_start) < now
      );
      
      if (racesThisYear.length > 0) {
        const progress = (completedRaces.length / racesThisYear.length) * 100;
        setSeasonProgress(Math.round(progress));
      } else {
        // Fallback al cálculo por fecha si no hay carreras
        const seasonStart = new Date(`${currentYear}-01-01`);
        const seasonEnd = new Date(`${currentYear}-12-31`);
        const total = seasonEnd - seasonStart;
        const elapsed = now - seasonStart;
        setSeasonProgress(Math.min(Math.max(Math.round((elapsed / total) * 100), 0), 100));
      }

      // Obtener podio real desde Ergast API
      await fetchRealPodium(nextRace || futureRaces[0] || pastRaces[0]);

    } catch (error) {
      console.error("❌ Error fetching race data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRealPodium = async (race) => {
    if (!race) {
      setLastPodium([]);
      return;
    }

    try {
      // Intentar obtener el podio del año y circuito desde Ergast API
      const year = race.year;
      const response = await fetch(
        `https://ergast.com/api/f1/${year}/results/1.json?limit=1000`
      );
      
      if (response.ok) {
        const data = await response.json();
        const races = data.MRData?.RaceTable?.Races || [];
        
        // Buscar la carrera que coincida con la ubicación
        const matchingRace = races.find(r => 
          r.Circuit?.Location?.locality?.toLowerCase().includes(race.location?.toLowerCase()) ||
          race.location?.toLowerCase().includes(r.Circuit?.Location?.locality?.toLowerCase())
        );

        if (matchingRace && matchingRace.Results) {
          const top3 = matchingRace.Results.slice(0, 3).map((result, index) => ({
            name: `${result.Driver?.givenName} ${result.Driver?.familyName}`,
            position: index + 1,
            team: result.Constructor?.name || ""
          }));
          
          if (top3.length > 0) {
            setLastPodium(top3);
            console.log("✅ Podio real obtenido:", top3);
            return;
          }
        }
      }
    } catch (error) {
      console.log("⚠️ No se pudo obtener podio real");
    }

    // No mostrar podio de ejemplo - dejar vacío
    setLastPodium([]);
  };

  const timeLeft = useCountdown(nextRace?.date_start || new Date());

  // Verificar si la próxima carrera es futura o pasada
  const isUpcoming = nextRace?.date_start && new Date(nextRace.date_start) > new Date();

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
        <div className="text-center text-gray-900">
          <h3 className="text-2xl font-bold mb-2">⚠️ Error al cargar carreras</h3>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={fetchNextRace}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!nextRace) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
        <div className="text-center text-gray-900">
          <h3 className="text-2xl font-bold">📭 No hay carreras disponibles</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gray-900 text-white py-4 px-8">
        <h2 className="text-2xl font-bold text-center">
          {isUpcoming ? "Cuenta Regresiva para la Próxima Carrera" : "Última Carrera de la Temporada"}
        </h2>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Race Info & Podium */}
          <div className="space-y-6">
            {/* Race Info */}
            <div className="flex items-center gap-4">
              <div className="bg-red-600 rounded-full p-3 w-20 h-20 flex items-center justify-center shadow-lg">
                <span className="text-3xl">🏁</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900">
                  {nextRace?.meeting_name || "GP Name"}
                </h3>
                <p className="text-gray-700">
                  📍 {nextRace?.location || nextRace?.circuit_short_name || "Location"}
                </p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {nextRace?.year && (
                    <span className="bg-gray-900 text-white text-xs px-3 py-1 rounded-full font-semibold">
                      Temporada {nextRace.year}
                    </span>
                  )}
                  {nextRace?.date_start && (
                    <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                      {new Date(nextRace.date_start).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Last Podium - Solo mostrar si hay datos */}
            {lastPodium.length > 0 && (
              <div>
                <h4 className="text-gray-900 text-lg font-semibold mb-4">
                  Último Podio en {nextRace?.location || "este circuito"}
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  {lastPodium.map((driver, index) => (
                    <div
                      key={index}
                      className={`relative rounded-xl p-4 pt-8 shadow-md ${
                        driver.position === 1
                          ? "bg-yellow-100 border-2 border-yellow-400 transform -translate-y-2"
                          : driver.position === 2
                          ? "bg-gray-100 border-2 border-gray-400"
                          : "bg-orange-100 border-2 border-orange-400"
                      }`}
                    >
                      <div
                        className={`absolute -top-3 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg ${
                          driver.position === 1
                            ? "bg-yellow-500"
                            : driver.position === 2
                            ? "bg-gray-400"
                            : "bg-orange-500"
                        } text-white`}
                      >
                        {driver.position === 1 ? "1º" : driver.position === 2 ? "2º" : "3º"}
                      </div>
                      <p className="text-center text-gray-800 font-semibold text-sm mt-2">
                        {driver.name}
                      </p>
                      {driver.team && (
                        <p className="text-center text-gray-600 text-xs mt-1">
                          {driver.team}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Countdown */}
          <div className="flex flex-col justify-center items-center">
            {/* Countdown Timer */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[
                { value: timeLeft.days, label: "DÍAS" },
                { value: timeLeft.hours, label: "HORAS" },
                { value: timeLeft.minutes, label: "MINS" },
                { value: timeLeft.seconds, label: "SEGS" },
              ].map((unit, index) => (
                <div key={index} className="text-center">
                  <div className="bg-gray-900 rounded-2xl p-6 min-w-[80px] shadow-lg">
                    <div className="text-5xl font-bold text-white tabular-nums">
                      {String(unit.value).padStart(2, "0")}
                    </div>
                  </div>
                  <div className="text-gray-700 text-sm font-semibold mt-2">
                    {unit.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Season Progress */}
            <div className="w-full">
              <div className="text-gray-900 text-center mb-2 font-semibold">
                {Math.round(seasonProgress)}% Completado
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-red-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${seasonProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

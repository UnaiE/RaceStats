import React, { useState, useEffect } from "react";

export default function WeatherForecast({ location, raceDate }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location) {
      fetchWeather();
    }
  }, [location, raceDate]);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      
      // Construir URL con race_date si está disponible
      let url = `http://localhost:8000/weather/${encodeURIComponent(location)}`;
      if (raceDate) {
        url += `?race_date=${encodeURIComponent(raceDate)}`;
      }
      
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        setWeather(data);
        setError(null);
      } else {
        setError("No se pudo obtener el pronóstico");
      }
    } catch (err) {
      console.error("Error fetching weather:", err);
      setError("Error al conectar con el servicio de clima");
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition) => {
    // Mapeo de condiciones a emojis
    const conditionLower = condition?.toLowerCase() || "";
    if (conditionLower.includes("lluv") || conditionLower.includes("rain"))
      return "🌧️";
    if (conditionLower.includes("llovizn") || conditionLower.includes("drizzle"))
      return "🌦️";
    if (conditionLower.includes("nublad") || conditionLower.includes("cloud"))
      return "☁️";
    if (conditionLower.includes("soleado") || conditionLower.includes("sunny"))
      return "☀️";
    if (conditionLower.includes("despej") || conditionLower.includes("clear"))
      return "🌤️";
    if (conditionLower.includes("tormenta") || conditionLower.includes("thunder"))
      return "⛈️";
    if (conditionLower.includes("nieve") || conditionLower.includes("snow"))
      return "🌨️";
    return "🌤️";
  };

  if (!location) return null;

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-pink-400 to-rose-400 rounded-2xl p-6 shadow-xl">
        <h3 className="text-white text-xl font-bold mb-4">Pronóstico del Tiempo</h3>
        <div className="animate-pulse flex space-x-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 bg-white/30 rounded-xl h-40"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-pink-400 to-rose-400 rounded-2xl p-6 shadow-xl">
        <h3 className="text-white text-xl font-bold mb-2">Pronóstico del Tiempo</h3>
        <p className="text-white/80 text-sm">{error}</p>
      </div>
    );
  }

  if (!weather || !weather.forecast) return null;

  return (
    <div className="bg-gradient-to-r from-pink-400 to-rose-400 rounded-2xl p-6 shadow-xl">
      <h3 className="text-white text-2xl font-bold mb-6 text-center">
        Pronóstico del Tiempo
      </h3>

      <div className="grid grid-cols-3 gap-4">
        {weather.forecast.map((day, index) => (
          <div
            key={index}
            className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30"
          >
            {/* Day Header */}
            <div className="text-center mb-3">
              <div className="text-white font-semibold text-lg">
                {day.day_name} {day.day_number}
              </div>
              {index === 0 && (
                <div className="text-white/70 text-xs mt-1">🏁 Prácticas</div>
              )}
              {index === 1 && (
                <div className="text-white/70 text-xs mt-1">⏱️ Clasificación</div>
              )}
              {index === 2 && (
                <div className="text-white/70 text-xs mt-1">🏆 Carrera</div>
              )}
            </div>

            {/* Weather Icon */}
            <div className="text-center mb-3">
              <span className="text-6xl">{getWeatherIcon(day.condition)}</span>
            </div>

            {/* Condition */}
            <div className="text-center mb-3">
              <span className="text-white font-medium text-sm">
                {day.condition}
              </span>
            </div>

            {/* Temperature */}
            <div className="flex justify-center items-center gap-3 mb-3">
              <div className="flex items-center gap-1">
                <span className="text-red-200 text-sm">🌡️</span>
                <span className="text-white font-bold">
                  {Math.round(day.max_temp)}°C
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-blue-200 text-sm">🌡️</span>
                <span className="text-white/80">
                  {Math.round(day.min_temp)}°C
                </span>
              </div>
            </div>

            {/* Rain Info */}
            <div className="flex justify-center items-center gap-2">
              <span className="text-blue-200">💧</span>
              <span className="text-white text-sm">
                {day.rain_mm} mm ({day.rain_chance}%)
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Location Info */}
      {weather.location && (
        <div className="text-center mt-4 text-white/80 text-sm">
          📍 {weather.location.name}, {weather.location.country}
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await fetch("http://localhost:8000/drivers/");
      if (!response.ok) throw new Error("Error al cargar pilotos");
      const data = await response.json();
      setDrivers(data);
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
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando pilotos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-xl">❌ {error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 text-blue-600 hover:underline"
          >
            Volver al Dashboard
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
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/dashboard")}
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
              Volver
            </button>
            <div className="flex items-center gap-2">
              <span className="text-3xl">👤</span>
              <h1 className="text-2xl font-bold text-gray-800">Pilotos</h1>
            </div>
            <div className="text-sm text-gray-600">
              {drivers.length} pilotos
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {drivers.map((driver) => (
            <div
              key={driver.driver_id || driver.driver_number}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-6">
                {/* Driver Number Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
                    style={{
                      backgroundColor: driver.team_colour || "#3B82F6",
                    }}
                  >
                    {driver.driver_number || "?"}
                  </div>
                  {driver.country_code && (
                    <span className="text-2xl">{driver.country_code}</span>
                  )}
                </div>

                {/* Driver Info */}
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {driver.full_name || driver.name_acronym || "Sin nombre"}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {driver.team_name || "Sin equipo"}
                </p>

                {/* Additional Info */}
                <div className="space-y-1 text-sm text-gray-600">
                  {driver.name_acronym && (
                    <p>
                      <span className="font-semibold">Acrónimo:</span>{" "}
                      {driver.name_acronym}
                    </p>
                  )}
                  {driver.headshot_url && (
                    <div className="mt-4">
                      <img
                        src={driver.headshot_url}
                        alt={driver.full_name}
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

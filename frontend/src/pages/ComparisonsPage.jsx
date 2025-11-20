import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ComparisonsPage() {
  const [drivers, setDrivers] = useState([]);
  const [selectedDrivers, setSelectedDrivers] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await fetch('http://localhost:8000/drivers/');
      if (!response.ok) throw new Error("Error al cargar pilotos");
      const data = await response.json();
      setDrivers(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toggleDriverSelection = (driver) => {
    if (selectedDrivers.find(d => d.driver_id === driver.driver_id)) {
      setSelectedDrivers(selectedDrivers.filter(d => d.driver_id !== driver.driver_id));
    } else {
      if (selectedDrivers.length < 4) {
        setSelectedDrivers([...selectedDrivers, driver]);
      } else {
        alert('Máximo 4 pilotos para comparar');
      }
    }
  };

  const compareDrivers = () => {
    if (selectedDrivers.length < 2) {
      alert('Selecciona al menos 2 pilotos para comparar');
      return;
    }

    const comparison = selectedDrivers.map(driver => ({
      name: `${driver.first_name} ${driver.last_name}`,
      team: driver.team_name || '-',
      number: driver.driver_number || '-',
      nationality: driver.country_code || driver.nationality || '-',
      championships: driver.championships || 0,
      wins: driver.wins || 0,
      podiums: driver.podiums || 0,
      points: driver.points || 0,
      headshot: driver.headshot_url,
      team_colour: driver.team_colour || '#6B7280',
    }));

    setComparisonData(comparison);
  };

  const saveComparison = async () => {
    if (!user?.id) {
      console.error("Usuario no disponible:", user);
      alert('Debes iniciar sesión para guardar comparaciones');
      return;
    }

    console.log("Guardando comparación con user.id:", user.id);

    try {
      const entityIds = selectedDrivers.map(d => d.driver_id).join(',');
      
      const response = await fetch('http://localhost:8000/comparisons/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          entity_type: 'driver',
          entity_ids: entityIds,
        }),
      });

      if (response.ok) {
        alert('Comparación guardada exitosamente');
      }
    } catch (error) {
      console.error("Error saving comparison:", error);
      alert('Error al guardar la comparación');
    }
  };

  const filteredDrivers = drivers.filter(driver => {
    const fullName = `${driver.first_name || ''} ${driver.last_name || ''}`.toLowerCase();
    const team = (driver.team_name || '').toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || team.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al Dashboard
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <span>📊</span>
            Comparador de Pilotos
          </h1>
          <p className="text-gray-600 mt-2">
            Compara estadísticas de hasta 4 pilotos simultáneamente
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Driver Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Seleccionar Pilotos ({selectedDrivers.length}/4)
              </h2>

              <input
                type="text"
                placeholder="Buscar piloto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />

              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredDrivers.map((driver) => {
                  const isSelected = selectedDrivers.find(d => d.driver_id === driver.driver_id);
                  
                  return (
                    <button
                      key={driver.driver_id}
                      onClick={() => toggleDriverSelection(driver)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        isSelected
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {driver.headshot_url && (
                          <img
                            src={driver.headshot_url}
                            alt={`${driver.first_name} ${driver.last_name}`}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold">
                            {driver.first_name} {driver.last_name}
                          </p>
                          <p className="text-sm opacity-75">
                            {driver.team_name || 'Sin equipo'}
                          </p>
                        </div>
                        {isSelected && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 space-y-2">
                <button
                  onClick={compareDrivers}
                  disabled={selectedDrivers.length < 2}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Comparar ({selectedDrivers.length})
                </button>
                
                {comparisonData.length > 0 && (
                  <button
                    onClick={saveComparison}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Guardar Comparación
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Comparison Results */}
          <div className="lg:col-span-2">
            {comparisonData.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Selecciona pilotos para comparar
                </h3>
                <p className="text-gray-600">
                  Elige al menos 2 pilotos de la lista para ver la comparación
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-red-600 to-red-800 text-white">
                  <h2 className="text-2xl font-bold">Resultados de la Comparación</h2>
                </div>

                {/* Driver Headers */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-gray-50">
                  {comparisonData.map((driver, index) => (
                    <div key={index} className="text-center">
                      {driver.headshot && (
                        <img
                          src={driver.headshot}
                          alt={driver.name}
                          className="w-24 h-24 rounded-full mx-auto mb-3 object-cover border-4"
                          style={{ borderColor: `#${driver.team_colour}` }}
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      )}
                      <h3 className="font-bold text-lg text-gray-900">{driver.name}</h3>
                      <p className="text-sm text-gray-600">{driver.team}</p>
                      <p className="text-xs text-gray-500 mt-1">#{driver.number}</p>
                    </div>
                  ))}
                </div>

                {/* Stats Comparison */}
                <div className="divide-y divide-gray-200">
                  {[
                    { label: 'Campeonatos', key: 'championships', icon: '🏆' },
                    { label: 'Victorias', key: 'wins', icon: '🥇' },
                    { label: 'Podios', key: 'podiums', icon: '🏅' },
                    { label: 'Puntos Totales', key: 'points', icon: '⭐' },
                  ].map((stat) => {
                    const maxValue = Math.max(...comparisonData.map(d => d[stat.key]));
                    
                    return (
                      <div key={stat.key} className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl">{stat.icon}</span>
                          <h4 className="font-semibold text-gray-900">{stat.label}</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {comparisonData.map((driver, index) => {
                            const value = driver[stat.key];
                            const isMax = value === maxValue && value > 0;
                            
                            return (
                              <div key={index} className="text-center">
                                <div className={`text-3xl font-bold ${isMax ? 'text-yellow-500' : 'text-gray-700'}`}>
                                  {value}
                                </div>
                                {isMax && <div className="text-xs text-yellow-600 font-semibold">MEJOR</div>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

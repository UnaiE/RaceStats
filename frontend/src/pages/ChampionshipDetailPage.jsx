// ChampionshipDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function ChampionshipDetailPage() {
  const [championship, setChampionship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('drivers'); // 'drivers' or 'constructors'
  const navigate = useNavigate();
  const { championshipId } = useParams();

  useEffect(() => {
    fetchChampionshipDetails();
  }, [championshipId]);

  const fetchChampionshipDetails = async () => {
    try {
      // Intentar primero con el endpoint directo
      const directResponse = await fetch(`http://localhost:8000/championships/${championshipId}`);
      
      if (directResponse.ok) {
        const data = await directResponse.json();
        setChampionship(data);
        return;
      }
      
      // Si falla, buscar en la lista completa
      const listResponse = await fetch("http://localhost:8000/championships/");
      if (!listResponse.ok) throw new Error("Error al cargar campeonatos");
      
      const allChampionships = await listResponse.json();
      const foundChampionship = allChampionships.find(
        (c) => String(c.year) === championshipId || 
               String(c.championship_id) === championshipId ||
               String(c._id) === championshipId
      );
      
      if (!foundChampionship) {
        throw new Error("Campeonato no encontrado");
      }
      
      setChampionship(foundChampionship);
      
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
          <p className="mt-4 text-gray-600">Cargando campeonato...</p>
        </div>
      </div>
    );
  }

  if (error || !championship) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-xl">❌ {error || "Campeonato no encontrado"}</p>
          <button
            onClick={() => navigate("/championships")}
            className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Volver a Campeonatos
          </button>
        </div>
      </div>
    );
  }

  const driverStandings = championship.driver_standings || [];
  const constructorStandings = championship.constructor_standings || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver a Campeonatos
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-red-600 to-red-800 p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  {championship.name || `Campeonato F1 ${championship.year}`}
                </h1>
                <div className="flex items-center gap-6 text-lg mt-4">
                  <span>📅 {championship.year}</span>
                  <span>🏁 {championship.completed_races || 0}/{championship.total_races || 0} Carreras</span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                    {championship.status === 'completed' ? 'Completado' : 'En Progreso'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-6xl mb-2">🏆</div>
              </div>
            </div>
          </div>

          {/* Champions */}
          {championship.champion_driver && (
            <div className="p-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {championship.champion_driver && (
                  <div className="bg-white rounded-lg p-6 border-2 border-yellow-400 shadow-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">👤</span>
                      <h3 className="text-xl font-bold text-gray-900">Campeón de Pilotos</h3>
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">
                      {championship.champion_driver}
                    </p>
                    {driverStandings[0] && (
                      <p className="text-sm text-gray-600 mt-2">
                        {driverStandings[0].points} puntos • {driverStandings[0].wins} victorias
                      </p>
                    )}
                  </div>
                )}
                {championship.champion_constructor && (
                  <div className="bg-white rounded-lg p-6 border-2 border-yellow-400 shadow-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">🏎️</span>
                      <h3 className="text-xl font-bold text-gray-900">Campeón de Constructores</h3>
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">
                      {championship.champion_constructor}
                    </p>
                    {constructorStandings[0] && (
                      <p className="text-sm text-gray-600 mt-2">
                        {constructorStandings[0].points} puntos • {constructorStandings[0].wins} victorias
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Standings Tabs */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('drivers')}
                className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                  activeTab === 'drivers'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">👤</span>
                Clasificación de Pilotos ({driverStandings.length})
              </button>
              <button
                onClick={() => setActiveTab('constructors')}
                className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                  activeTab === 'constructors'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">🏎️</span>
                Clasificación de Constructores ({constructorStandings.length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'drivers' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Pos</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Piloto</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Equipo</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Puntos</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Victorias</th>
                    </tr>
                  </thead>
                  <tbody>
                    {driverStandings.map((driver, index) => (
                      <tr
                        key={index}
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          index === 0 ? 'bg-yellow-50' : ''
                        }`}
                      >
                        <td className="px-4 py-4">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                            index === 0 ? 'bg-yellow-400 text-white' :
                            index === 1 ? 'bg-gray-300 text-gray-800' :
                            index === 2 ? 'bg-orange-300 text-white' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {driver.position || index + 1}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="font-semibold text-gray-900">
                            {driver.driver_name}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-gray-600">
                          {driver.team || '-'}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="font-bold text-lg text-red-600">
                            {driver.points}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center text-gray-700">
                          {driver.wins || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'constructors' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Pos</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Constructor</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Puntos</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Victorias</th>
                    </tr>
                  </thead>
                  <tbody>
                    {constructorStandings.map((constructor, index) => (
                      <tr
                        key={index}
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          index === 0 ? 'bg-yellow-50' : ''
                        }`}
                      >
                        <td className="px-4 py-4">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                            index === 0 ? 'bg-yellow-400 text-white' :
                            index === 1 ? 'bg-gray-300 text-gray-800' :
                            index === 2 ? 'bg-orange-300 text-white' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {constructor.position || index + 1}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="font-semibold text-gray-900">
                            {constructor.constructor_name}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="font-bold text-lg text-red-600">
                            {constructor.points}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center text-gray-700">
                          {constructor.wins || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

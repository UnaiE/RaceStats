// Este archivo contiene todas las páginas de detalle adicionales
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// ============================================
// CIRCUIT DETAIL PAGE
// ============================================
export function CircuitDetailPage() {
  const [circuit, setCircuit] = useState(null);
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { circuitId } = useParams();

  useEffect(() => {
    fetchCircuitDetails();
  }, [circuitId]);

  const fetchCircuitDetails = async () => {
    try {
      const response = await fetch("http://localhost:8000/circuits/");
      if (!response.ok) throw new Error("Error al cargar circuito");
      const data = await response.json();
      
      const foundCircuit = data.find(
        (c) => String(c.circuit_key) === circuitId || 
               String(c.circuit_id) === circuitId ||
               encodeURIComponent(c.circuit_short_name) === circuitId
      );
      
      if (!foundCircuit) {
        throw new Error("Circuito no encontrado");
      }
      
      setCircuit(foundCircuit);

      // Obtener carreras en este circuito
      const racesResponse = await fetch("http://localhost:8000/races/");
      if (racesResponse.ok) {
        const racesData = await racesResponse.json();
        const circuitRaces = racesData.filter(
          (r) => r.circuit_short_name === foundCircuit.circuit_short_name ||
                 r.circuit_key === foundCircuit.circuit_key
        );
        setRaces(circuitRaces);
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
          <p className="mt-4 text-gray-600">Cargando información del circuito...</p>
        </div>
      </div>
    );
  }

  if (error || !circuit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-xl">❌ {error || "Circuito no encontrado"}</p>
          <button
            onClick={() => navigate("/circuits")}
            className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Volver a Circuitos
          </button>
        </div>
      </div>
    );
  }

  // URL de imagen del circuito (ejemplo genérico, puedes personalizarlo)
  const circuitImageUrl = `https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/${circuit.circuit_short_name?.toLowerCase().replace(/ /g, '_')}_circuit.png`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate("/circuits")}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver a Circuitos
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Hero Section with Circuit Image */}
          <div className="relative h-96 bg-gradient-to-r from-gray-800 to-gray-900 overflow-hidden">
            <img
              src={circuitImageUrl}
              alt={circuit.circuit_short_name}
              className="w-full h-full object-cover opacity-40"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white z-10">
                <h1 className="text-5xl font-bold mb-2 drop-shadow-lg">
                  {circuit.circuit_short_name}
                </h1>
                <p className="text-2xl opacity-90">
                  {circuit.location || circuit.country_name}
                </p>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-red-600" />
          </div>

          {/* Circuit Details Grid */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Información del Circuito
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {circuit.circuit_short_name && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 font-semibold mb-1">Nombre</p>
                  <p className="text-xl font-bold text-gray-900">
                    {circuit.circuit_short_name}
                  </p>
                </div>
              )}

              {circuit.location && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 font-semibold mb-1">Ubicación</p>
                  <p className="text-xl font-bold text-gray-900">
                    {circuit.location}
                  </p>
                </div>
              )}

              {circuit.country_name && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 font-semibold mb-1">País</p>
                  <p className="text-xl font-bold text-gray-900">
                    {circuit.country_name}
                  </p>
                </div>
              )}
            </div>

            {/* Races at this Circuit */}
            {races.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Carreras en este Circuito ({races.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {races.slice(0, 9).map((race) => (
                    <div
                      key={race.session_key}
                      onClick={() => navigate(`/races/${race.session_key}`)}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
                    >
                      <p className="font-bold text-gray-900">{race.meeting_name}</p>
                      <p className="text-sm text-gray-600">{race.year}</p>
                      {race.date_start && (
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(race.date_start).toLocaleDateString("es-ES")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// ============================================
// SEASON DETAIL PAGE (con standings)
// ============================================
export function SeasonDetailPage() {
  const [season, setSeason] = useState(null);
  const [standings, setStandings] = useState([]);
  const [constructorStandings, setConstructorStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { seasonId } = useParams();

  useEffect(() => {
    fetchSeasonDetails();
  }, [seasonId]);

  const fetchSeasonDetails = async () => {
    try {
      const response = await fetch("http://localhost:8000/seasons/");
      if (!response.ok) throw new Error("Error al cargar temporada");
      const data = await response.json();
      
      const foundSeason = data.find(
        (s) => String(s.year) === seasonId
      );
      
      if (!foundSeason) {
        throw new Error("Temporada no encontrada");
      }
      
      setSeason(foundSeason);

      // Obtener standings desde Ergast
      await fetchSeasonStandings(foundSeason.year);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSeasonStandings = async (year) => {
    try {
      // Driver Standings
      const driversResponse = await fetch(
        `https://ergast.com/api/f1/${year}/driverStandings.json`
      );
      
      if (driversResponse.ok) {
        const data = await driversResponse.json();
        const standings = data.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings || [];
        setStandings(standings);
      }

      // Constructor Standings
      const constructorsResponse = await fetch(
        `https://ergast.com/api/f1/${year}/constructorStandings.json`
      );
      
      if (constructorsResponse.ok) {
        const data = await constructorsResponse.json();
        const constructorStandings = data.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings || [];
        setConstructorStandings(constructorStandings);
      }
    } catch (error) {
      console.log("⚠️ No se pudieron obtener standings");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando temporada...</p>
        </div>
      </div>
    );
  }

  if (error || !season) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-xl">❌ {error || "Temporada no encontrada"}</p>
          <button
            onClick={() => navigate("/seasons")}
            className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Volver a Temporadas
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
            onClick={() => navigate("/seasons")}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver a Temporadas
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Season Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-red-600 to-red-800 flex items-center justify-center">
            <h1 className="text-6xl font-bold text-white drop-shadow-lg">
              Temporada {season.year}
            </h1>
          </div>
        </div>

        {/* Driver Standings */}
        {standings.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>🏆</span>
              Clasificación de Pilotos
            </h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-900 text-white">
                    <th className="px-4 py-3 text-left font-semibold">Pos</th>
                    <th className="px-4 py-3 text-left font-semibold">Piloto</th>
                    <th className="px-4 py-3 text-left font-semibold">Equipo</th>
                    <th className="px-4 py-3 text-left font-semibold">Puntos</th>
                    <th className="px-4 py-3 text-left font-semibold">Victorias</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((driver, index) => (
                    <tr
                      key={index}
                      className={`border-b border-gray-200 hover:bg-gray-50 ${
                        parseInt(driver.position) === 1 ? "bg-yellow-50" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="font-bold text-xl">{driver.position}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-900">
                          {driver.Driver?.givenName} {driver.Driver?.familyName}
                        </div>
                        <div className="text-sm text-gray-600">
                          {driver.Driver?.nationality}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {driver.Constructors?.[0]?.name}
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-red-600 text-white px-4 py-2 rounded-full font-bold">
                          {driver.points}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-lg font-bold text-gray-900">
                          {driver.wins}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Constructor Standings */}
        {constructorStandings.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>🏎️</span>
              Clasificación de Constructores
            </h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-900 text-white">
                    <th className="px-4 py-3 text-left font-semibold">Pos</th>
                    <th className="px-4 py-3 text-left font-semibold">Equipo</th>
                    <th className="px-4 py-3 text-left font-semibold">Puntos</th>
                    <th className="px-4 py-3 text-left font-semibold">Victorias</th>
                  </tr>
                </thead>
                <tbody>
                  {constructorStandings.map((constructor, index) => (
                    <tr
                      key={index}
                      className={`border-b border-gray-200 hover:bg-gray-50 ${
                        parseInt(constructor.position) === 1 ? "bg-yellow-50" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="font-bold text-xl">{constructor.position}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-900">
                          {constructor.Constructor?.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {constructor.Constructor?.nationality}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-red-600 text-white px-4 py-2 rounded-full font-bold">
                          {constructor.points}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-lg font-bold text-gray-900">
                          {constructor.wins}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ============================================
// CHAMPIONSHIP DETAIL PAGE (similar a Season)
// ============================================
export function ChampionshipDetailPage() {
  const navigate = useNavigate();
  const { championshipId } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate("/championships")}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver a Campeonatos
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Campeonato #{championshipId}
          </h1>
          <p className="text-gray-600">
            Detalles del campeonato (próximamente con standings completos)
          </p>
        </div>
      </main>
    </div>
  );
}

// ============================================
// CAR DETAIL PAGE (con especificaciones técnicas)
// ============================================
export function CarDetailPage() {
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { carId } = useParams();

  useEffect(() => {
    fetchCarDetails();
  }, [carId]);

  const fetchCarDetails = async () => {
    try {
      const response = await fetch("http://localhost:8000/cars/");
      if (!response.ok) throw new Error("Error al cargar coche");
      const data = await response.json();
      
      const foundCar = data.find(
        (c) => String(c.car_id) === carId || String(c.car_number) === carId
      );
      
      if (!foundCar) {
        throw new Error("Coche no encontrado");
      }
      
      setCar(foundCar);
      
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
          <p className="mt-4 text-gray-600">Cargando información del coche...</p>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-xl">❌ {error || "Coche no encontrado"}</p>
          <button
            onClick={() => navigate("/cars")}
            className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Volver a Coches
          </button>
        </div>
      </div>
    );
  }

  // URL de imagen del coche (ejemplo, ajusta según tu estructura)
  const carImageUrl = car.image_url || `https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/${car.team_name?.toLowerCase().replace(/ /g, '-')}.png`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate("/cars")}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver a Coches
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Hero Section with Car Image */}
          <div 
            className="relative h-96 flex items-center justify-center overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${car.team_colour || '#1f2937'}dd, ${car.team_colour || '#1f2937'})`
            }}
          >
            <img
              src={carImageUrl}
              alt={`${car.team_name} Car`}
              className="h-full object-contain drop-shadow-2xl"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <div className="absolute bottom-8 left-8 text-white">
              <h1 className="text-5xl font-bold drop-shadow-lg">
                {car.team_name || "F1 Car"}
              </h1>
              {car.car_number && (
                <p className="text-3xl opacity-90 mt-2">
                  #{car.car_number}
                </p>
              )}
            </div>
          </div>

          {/* Car Specifications */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Especificaciones Técnicas
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {car.team_name && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 font-semibold mb-1">Equipo</p>
                  <p className="text-xl font-bold text-gray-900">
                    {car.team_name}
                  </p>
                </div>
              )}

              {car.car_number && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 font-semibold mb-1">Número de Coche</p>
                  <p className="text-3xl font-bold text-gray-900">
                    #{car.car_number}
                  </p>
                </div>
              )}

              {car.team_colour && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 font-semibold mb-1">Color del Equipo</p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-16 h-16 rounded-lg shadow-md border-2 border-white"
                      style={{ backgroundColor: car.team_colour }}
                    ></div>
                    <p className="text-sm font-mono text-gray-700">
                      {car.team_colour}
                    </p>
                  </div>
                </div>
              )}

              {car.driver_number && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 font-semibold mb-1">Número de Piloto</p>
                  <p className="text-3xl font-bold text-gray-900">
                    #{car.driver_number}
                  </p>
                </div>
              )}

              {car.session_key && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 font-semibold mb-1">Session Key</p>
                  <p className="text-lg font-mono text-gray-900">
                    {car.session_key}
                  </p>
                </div>
              )}

              {car.meeting_key && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 font-semibold mb-1">Meeting Key</p>
                  <p className="text-lg font-mono text-gray-900">
                    {car.meeting_key}
                  </p>
                </div>
              )}
            </div>

            {/* Car Image Gallery */}
            {car.image_url && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Galería
                </h2>
                <div className="bg-gray-50 rounded-lg p-8 border border-gray-200 flex justify-center">
                  <img
                    src={car.image_url}
                    alt={`${car.team_name} Car`}
                    className="h-64 object-contain"
                    onError={(e) => {
                      e.target.parentElement.innerHTML = '<p class="text-gray-500">Imagen no disponible</p>';
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

import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import RaceCountdown from "../components/RaceCountdown";
import F1News from "../components/F1News";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const sections = [
    {
      title: "Pilotos",
      icon: "👤",
      description: "Explora todos los pilotos de F1",
      color: "from-blue-500 to-blue-700",
      path: "/drivers",
    },
    {
      title: "Equipos",
      icon: "🏎️",
      description: "Descubre los equipos de la parrilla",
      color: "from-red-500 to-red-700",
      path: "/teams",
    },
    {
      title: "Carreras",
      icon: "🏁",
      description: "Resultados y estadísticas de carreras",
      color: "from-green-500 to-green-700",
      path: "/races",
    },
    {
      title: "Circuitos",
      icon: "🛣️",
      description: "Todos los circuitos del calendario",
      color: "from-purple-500 to-purple-700",
      path: "/circuits",
    },
    {
      title: "Temporadas",
      icon: "📅",
      description: "Consulta temporadas históricas",
      color: "from-orange-500 to-orange-700",
      path: "/seasons",
    },
    {
      title: "Campeonatos",
      icon: "🏆",
      description: "Campeonatos y clasificaciones",
      color: "from-yellow-500 to-yellow-700",
      path: "/championships",
    },
    {
      title: "Coches",
      icon: "🚗",
      description: "Monoplazas de cada temporada",
      color: "from-indigo-500 to-indigo-700",
      path: "/cars",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏎️</span>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">RaceStats</h1>
                <p className="text-sm text-gray-600">
                  Portal de estadísticas de F1
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Bienvenido/a,</p>
                <p className="font-semibold text-gray-800">{user?.username}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Race Countdown with Weather */}
        <div className="mb-12">
          <RaceCountdown />
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            ¿Qué quieres explorar hoy?
          </h2>
          <p className="text-gray-600">
            Selecciona una categoría para ver estadísticas detalladas
          </p>
        </div>

        {/* Grid de cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sections.map((section, index) => (
            <button
              key={index}
              onClick={() => navigate(section.path)}
              className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
            >
              {/* Gradient background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              <div className="relative p-6">
                {/* Icon */}
                <div className="text-5xl mb-4">{section.icon}</div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {section.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4">
                  {section.description}
                </p>

                {/* Arrow indicator */}
                <div className="flex items-center text-blue-600 font-medium text-sm">
                  <span>Ver más</span>
                  <svg
                    className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Stats quick view */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pilotos</p>
                <p className="text-3xl font-bold text-blue-600">55</p>
              </div>
              <div className="text-4xl">👤</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Equipos</p>
                <p className="text-3xl font-bold text-red-600">13</p>
              </div>
              <div className="text-4xl">🏎️</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Carreras</p>
                <p className="text-3xl font-bold text-green-600">151</p>
              </div>
              <div className="text-4xl">🏁</div>
            </div>
          </div>
        </div>

        {/* F1 News Section */}
        <div className="mt-12">
          <F1News limit={10} />
        </div>
      </main>
    </div>
  );
}

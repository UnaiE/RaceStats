import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import DriversPage from "./pages/DriversPage";
import DriverDetailPage from "./pages/DriverDetailPage";
import TeamsPage from "./pages/TeamsPage";
import TeamDetailPage from "./pages/TeamDetailPage";
import RacesPage from "./pages/RacesPage";
import RaceDetailPage from "./pages/RaceDetailPage";
import { CircuitsPage, SeasonsPage, ChampionshipsPage, CarsPage } from "./pages/OtherPages";
import { 
  CircuitDetailPage, 
  SeasonDetailPage, 
  CarDetailPage 
} from "./pages/DetailPages";
import { ChampionshipDetailPage } from "./pages/ChampionshipDetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import ComparisonsPage from "./pages/ComparisonsPage";

// Componente para proteger rutas
function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/" />;
}

// Componente para redirigir si ya está autenticado
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta pública */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            }
          />

          {/* Rutas protegidas */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/drivers"
            element={
              <PrivateRoute>
                <DriversPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/drivers/:driverId"
            element={
              <PrivateRoute>
                <DriverDetailPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/teams"
            element={
              <PrivateRoute>
                <TeamsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/teams/:teamId"
            element={
              <PrivateRoute>
                <TeamDetailPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/races"
            element={
              <PrivateRoute>
                <RacesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/races/:raceId"
            element={
              <PrivateRoute>
                <RaceDetailPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/circuits"
            element={
              <PrivateRoute>
                <CircuitsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/circuits/:circuitId"
            element={
              <PrivateRoute>
                <CircuitDetailPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/seasons"
            element={
              <PrivateRoute>
                <SeasonsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/seasons/:seasonId"
            element={
              <PrivateRoute>
                <SeasonDetailPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/championships"
            element={
              <PrivateRoute>
                <ChampionshipsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/championships/:championshipId"
            element={
              <PrivateRoute>
                <ChampionshipDetailPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/cars"
            element={
              <PrivateRoute>
                <CarsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/cars/:carId"
            element={
              <PrivateRoute>
                <CarDetailPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <PrivateRoute>
                <FavoritesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/comparisons"
            element={
              <PrivateRoute>
                <ComparisonsPage />
              </PrivateRoute>
            }
          />

          {/* Ruta 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

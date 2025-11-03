// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={<div className="p-10 text-center text-2xl">🏎️ Bienvenido a RaceStats</div>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

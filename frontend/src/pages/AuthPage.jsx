import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const handleLoginSuccess = (userData) => {
    console.log("Login exitoso:", userData);
    // Aquí puedes guardar el usuario en localStorage, Context, Redux, etc.
    // localStorage.setItem("user", JSON.stringify(userData));
    // Redirigir a dashboard o página principal
  };

  const handleRegisterSuccess = (userData) => {
    console.log("Registro exitoso:", userData);
    // Cambiar automáticamente a login después de registrarse
    setTimeout(() => setIsLogin(true), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Logo o título de la aplicación */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">🏎️ RaceStats</h1>
        <p className="text-gray-600">Tu portal de estadísticas de F1</p>
      </div>

      {/* Formulario dinámico */}
      {isLogin ? (
        <LoginForm
          onSuccess={handleLoginSuccess}
          onSwitchToRegister={() => setIsLogin(false)}
        />
      ) : (
        <RegisterForm
          onSuccess={handleRegisterSuccess}
          onSwitchToLogin={() => setIsLogin(true)}
        />
      )}
    </div>
  );
}

import React, { useState } from "react";

export default function RegisterForm({ onSuccess, onSwitchToLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Validaciones
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setMessage("Creando cuenta...");

    try {
      const response = await fetch("http://127.0.0.1:8000/users/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al crear la cuenta");
      }

      const data = await response.json();
      setMessage(`¡Cuenta creada! Bienvenido/a, ${data.username}`);
      
      // Limpiar formulario
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Callback de éxito (opcional)
      if (onSuccess) {
        setTimeout(() => onSuccess(data), 1500);
      }
    } catch (error) {
      setError(error.message);
      setMessage("");
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 w-96">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">
        Crear cuenta
      </h1>
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <div>
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            minLength={3}
          />
        </div>

        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            minLength={6}
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white rounded-lg p-2 font-semibold transition-colors"
        >
          Crear cuenta
        </button>
      </form>

      {message && (
        <p className="text-center text-sm mt-4 text-green-600 font-medium">
          {message}
        </p>
      )}
      {error && (
        <p className="text-center text-sm mt-4 text-red-600 font-medium">
          {error}
        </p>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={onSwitchToLogin}
          className="text-blue-500 hover:text-blue-700 text-sm font-medium"
        >
          ¿Ya tienes cuenta? Inicia sesión
        </button>
      </div>
    </div>
  );
}

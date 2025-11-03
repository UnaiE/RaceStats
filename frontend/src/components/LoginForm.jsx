import React, { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("Procesando...");

    try {
      const response = await fetch("http://127.0.0.1:8000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Credenciales incorrectas");

      const data = await response.json();
      setMessage(`Bienvenido, ${data.username || "usuario"}`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 w-80">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-700">
        Iniciar sesión
      </h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-2 font-semibold"
        >
          Entrar
        </button>
      </form>
      {message && (
        <p className="text-center text-sm mt-4 text-gray-600">{message}</p>
      )}
    </div>
  );
}

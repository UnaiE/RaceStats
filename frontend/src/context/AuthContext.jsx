import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario del localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("racestats_user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Normalizar user_id a id si es necesario
      const normalizedUser = {
        id: parsedUser.user_id || parsedUser.id,
        username: parsedUser.username,
        email: parsedUser.email
      };
      setUser(normalizedUser);
      // Actualizar localStorage con la estructura normalizada
      localStorage.setItem("racestats_user", JSON.stringify(normalizedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("racestats_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("racestats_user");
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

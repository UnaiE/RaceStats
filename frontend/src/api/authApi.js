// src/api/authApi.js
import axios from "axios";

const API_URL = "http://localhost:8000";

/**
 * Iniciar sesión de usuario
 */
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { 
      email, 
      password 
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || "Error al iniciar sesión";
  }
};

/**
 * Registrar nuevo usuario
 */
export const registerUser = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/users/`, { 
      username, 
      email, 
      password 
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || "Error al crear la cuenta";
  }
};

/**
 * Obtener perfil de usuario (requiere autenticación)
 */
export const getUserProfile = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || "Error al obtener perfil";
  }
};

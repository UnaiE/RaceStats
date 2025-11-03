// src/api/authApi.js
import axios from "axios";

const API_URL = "http://localhost:8000"; // tu backend FastAPI

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || "Error al iniciar sesión";
  }
};

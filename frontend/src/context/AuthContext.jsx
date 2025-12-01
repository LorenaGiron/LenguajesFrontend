// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";
import { loginRequest, getProfileRequest } from "../api/auth.api";

const AuthContext = createContext();
const TOKEN_KEY = "access_token";

export const AuthProvider = ({ children }) => {
  // leer token desde la misma clave que usa auth.api
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  const login = async (username, password) => {
    try {
      // obtener token (loginRequest ya guarda response.data, pero aquí devolvemos token)
      const tokenResponse = await loginRequest(username, password);
      // loginRequest retorna response.data que contiene access_token
      const receivedToken = tokenResponse?.access_token;
      if (!receivedToken) throw new Error("Token no recibido del servidor.");

      // persistir token con la misma clave
      setToken(receivedToken);
      localStorage.setItem(TOKEN_KEY, receivedToken);
      setIsAuthenticated(true);

      // Obtener perfil (getProfileRequest ya devuelve response.data o el objeto perfil)
      const profileResponse = await getProfileRequest();

      // Manejar ambos casos: si la API retornó { data: profile } o profile directamente
      const profile = profileResponse?.data ?? profileResponse;

      if (!profile) throw new Error("No se pudo obtener el perfil de usuario.");

      setUser(profile);
      setRole(profile.role || null);

      return profile.role;
    } catch (error) {
      console.error("Error during login:", error);
      // limpiar si algo quedó a medias
      setToken(null);
      localStorage.removeItem(TOKEN_KEY);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setRole(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    role,
    token,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

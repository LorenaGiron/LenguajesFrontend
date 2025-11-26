import { createContext, useContext, useState } from "react";
import { loginRequest, getProfileRequest } from "../api/auth.api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  const login = async (username, password) => {
    try {
      // 1. Obtener token
      const tokenResponse = await loginRequest(username, password);
      const receivedToken = tokenResponse.access_token;

      setToken(receivedToken);
      localStorage.setItem("token", receivedToken);
      setIsAuthenticated(true);

      // 2. Obtener perfil
      const profileResponse = await getProfileRequest();

      setUser(profileResponse);
      setRole(profileResponse.role);   

      return profileResponse.role;
    } catch (error) {
      console.error("Error during login:", error);
      throw new Error("Credenciales inválidas o error de red.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token"); 
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("userRole");
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

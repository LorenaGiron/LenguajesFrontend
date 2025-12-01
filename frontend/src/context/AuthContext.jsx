import { createContext, useContext, useState, useEffect } from "react";
import { loginRequest, getProfileRequest } from "../api/auth.api";

const AuthContext = createContext();
const TOKEN_KEY = "access_token";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) return;

      try {
        const profileResponse = await getProfileRequest();
        const profile = profileResponse?.data ?? profileResponse;

        setUser(profile);
        setRole(profile.role || null);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Error cargando perfil:", err);
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setIsAuthenticated(false);
      }
    };

    loadProfile();
  }, [token]);

  const login = async (username, password) => {
    try {
      const tokenResponse = await loginRequest(username, password);
      const receivedToken = tokenResponse?.access_token;
      
      if (!receivedToken) throw new Error("Token no recibido del servidor.");

      setToken(receivedToken);
      localStorage.setItem(TOKEN_KEY, receivedToken);
      setIsAuthenticated(true);

      const profileResponse = await getProfileRequest();
      const profile = profileResponse?.data ?? profileResponse;

      if (!profile) throw new Error("No se pudo obtener el perfil de usuario.");

      setUser(profile);
      setRole(profile.role || null);

      return profile.role;
    } catch (error) {
      console.error("Error during login:", error);
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

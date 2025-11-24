import { createContext, useContext, useState } from "react";
import http from "../api/http"; 
import { loginRequest, getProfileRequest } from "../api/auth.api"; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token); 

  const login = async (username, password) => {
    try {
        //Petición de Token
        const tokenResponse = await loginRequest(username, password); 
        const receivedToken = tokenResponse.access_token;
        //Guardar Token
        setToken(receivedToken);
        localStorage.setItem("token", receivedToken);
        setIsAuthenticated(true);
        //Petición de Perfil (Usando el token recién guardado)
        const profileResponse = await getProfileRequest();
        setUser(profileResponse); 
        return profileResponse.role; 

    } catch (error) {
        throw new Error("Credenciales inválidas o error de red.");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
  };

  const value = {
    user,
    token,
    login, 
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
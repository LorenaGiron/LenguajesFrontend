import { createContext, useContext, useState } from "react";
import http from "../api/http";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const login = async (username, password) => {
    const response = await http.post("/auth/login", {
      username,
      password,
    });

    const receivedToken = response.data.access_token;

    setToken(receivedToken);
    localStorage.setItem("token", receivedToken);

    setUser({ username });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

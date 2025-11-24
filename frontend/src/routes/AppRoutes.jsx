import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import { useAuth } from "../context/AuthContext";

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Ruta de login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Redirigir raíz */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

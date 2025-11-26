import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import { useAuth } from "../context/AuthContext";

// SOLO PARA HACER PRUEBAS NO ESTA COMPLETO
const Dashboard = () => <h1>¡Bienvenido al Panel Principal!</h1>;

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* RUTA PROTEGIDA AGREGADA */}
      <Route 
        path="/dashboard" 
        element={
            <PrivateRoute>
                <Dashboard />
            </PrivateRoute>
        } 
      />

      {/* Redirigir raíz al dashboard si está logueado, o login si no */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}
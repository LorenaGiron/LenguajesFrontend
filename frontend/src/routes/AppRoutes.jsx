import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import { useAuth } from "../context/AuthContext";


import AdminDashboard from "../pages/Dashboardadmin";
import TeacherDashboard from "../pages/Dashboardteacher";


function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* 1. RUTA DE ADMINISTRADOR */}
      <Route 
        path="/admin/dashboard" 
        element={
            <PrivateRoute>
                <AdminDashboard />
            </PrivateRoute>
        } 
      />

      {/* 2. RUTA DE PROFESOR */}
      <Route 
        path="/profesor/dashboard" 
        element={
            <PrivateRoute>
                <TeacherDashboard />
            </PrivateRoute>
        } 
      />

      {/* Redirigir a la ruta base de login si no hay nada */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
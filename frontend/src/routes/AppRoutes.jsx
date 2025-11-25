import { Routes, Route, Navigate } from "react-router-dom";
//import { useAuth } from "../context/AuthContext";
import AdminDashboard from "../pages/DashboardAdmin";
import TeacherDashboard from "../pages/Dashboardteacher";
import LoginPage from "../pages/LoginPage";
import Register from "../pages/Register";
import StudentsPage from "../pages/StudentsPage";
/*
function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}
*/
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* 1. RUTA DE ADMINISTRADOR */}
      <Route 
        path="/admin/dashboard" 
        element={
            /*<PrivateRoute>*/
                <AdminDashboard />
            /*</PrivateRoute>*/
        } 
      />

      <Route
        path="/admin/register"
        element={
          /*<PrivateRoute>*/
            <Register />
          /*</PrivateRoute>*/
        }
      />

      {/* 2. RUTA DE PROFESOR */}
      <Route 
        path="/profesor/dashboard" 
        element={
            /*<PrivateRoute>*/
                <TeacherDashboard />
            /*</PrivateRoute>*/
        } 
      />

      {/* 3. RUTA DE ALUMNO */}
      <Route 
        path="/alumno/dashboard" 
        element={
            /* <PrivateRoute> */
                <StudentsPage />
            /* </PrivateRoute> */
        } 
      />

      {/* Redirigir a la ruta base de login si no hay nada */}
      
    </Routes>
  );
}
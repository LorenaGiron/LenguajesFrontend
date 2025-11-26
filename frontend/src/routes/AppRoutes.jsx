import { Routes, Route, Navigate } from "react-router-dom";
//import { useAuth } from "../context/AuthContext";
import AdminDashboard from "../pages/DashboardAdmin";
import AdminPage from "../pages/AdminPage";  
import TeacherDashboard from "../pages/Dashboardteacher";
import LoginPage from "../pages/LoginPage";
import Register from "../pages/Register";
import StudentsPage from "../pages/StudentsPage";
import LandingPage from "../pages/LandingPage";
/*
function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}
*/
export default function AppRoutes() {
  return (
    <Routes>
         {/* Ruta raíz → LandingPage */}
      <Route path="/" element={<LandingPage />} />
      
      <Route path="/login" element={<LoginPage />} />

      {/* 1. RUTA DE ADMINISTRADOR */}
      <Route path="/admin" element={<AdminPage />}>
        
        {/* Dashboard del admin */}
        <Route path="dashboard" element={<AdminDashboard />} />

        {/* Alumnos (tu StudentsPage.jsx) */}
        <Route path="alumnos" element={<StudentsPage />} />

        {/* Registro (si quieres dentro del admin) */}
        <Route path="register" element={<Register />} />

      </Route>

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
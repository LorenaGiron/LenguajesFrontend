import { Routes, Route, Navigate } from "react-router-dom";
//import { useAuth } from "../context/AuthContext";
import AdminDashboard from "../pages/DashboardAdmin";
import AdminPage from "../pages/AdminPage";  
import TeacherLayout from "../pages/TeacherLayout";
import TeacherDashboard from "../pages/TeacherDashboard";
import TeacherSubjects from "../pages/TeacherSubjects";
import TeacherStudents from "../pages/TeacherStudents";
import TeacherGrades from "../pages/TeacherGrades";
import TeacherReports from "../pages/TeacherReports";
import LoginPage from "../pages/LoginPage";
import RegisterStudent from "../pages/RegisterStudent";
import StudentsPage from "../pages/StudentsPage";
import LandingPage from "../pages/LandingPage";
import TeachersList from "../pages/TeacherPageList";
import ProfessorForm from "../components/professors/ProfessorForm";
import SubjectForm from "../components/subject/SubjectForm";
import SubjectList from "../pages/SubjectsPage";

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
        <Route path="register-student" element={<RegisterStudent />} />

        <Route path="profesores-list" element={<TeachersList />} />
        <Route path="register-professor" element={< ProfessorForm/>} />
       <Route path="/admin/register-materia" element={<SubjectForm />} />
        <Route path="/admin/materias" element={<SubjectList />} />
      </Route>

      {/* 2. RUTA DE PROFESOR */}
      <Route path="/profesor" element={<TeacherLayout />}>
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="materias" element={<TeacherSubjects />} />
        <Route path="materias/:id/alumnos" element={<TeacherStudents />} />
        <Route path="calificaciones" element={<TeacherGrades />} />
        <Route path="reportes" element={<TeacherReports />} />
      </Route>
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
import { Routes, Route, Navigate } from "react-router-dom";
//import { useAuth } from "../context/AuthContext";
import AdminDashboard from "../pages/DashboardAdmin";
import AdminPage from "../pages/AdminPage";  
import TeacherDashboard from "../pages/Dashboardteacher";
import LoginPage from "../pages/LoginPage";
import RegisterStudent from "../pages/RegisterStudent";
import StudentsPage from "../pages/StudentsPage";
import LandingPage from "../pages/LandingPage";
import TeachersList from "../pages/TeacherPageList";
import ProfessorForm from "../components/professors/ProfessorForm";
import SubjectForm from "../components/subject/SubjectForm";
import SubjectList from "../pages/SubjectsPage.jsx";
import ReportsPage from "../pages/ReportsPage.jsx";
import IndividualReport from "../components/students/IndividualReport";
import GradeSubject from "../pages/GradeSubjectReportAdmin.jsx";

import AssignStudents from "../pages/AssignmentPage.jsx";
import TeacherAssigment from "../pages/TeacherAssigment.jsx";
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

        {/* Alumnos */}
        <Route path="alumnos" element={<StudentsPage />} />
        <Route path="/admin/assign" element={<AssignStudents />} />
        

        {/* Registro (si quieres dentro del admin) */}
        <Route path="register-student" element={<RegisterStudent />} />
        
        {/* Profesores */}
        <Route path="profesores-list" element={<TeachersList />} />
        <Route path="register-professor" element={< ProfessorForm/>} />
        
        {/* Materias */}
        <Route path="register-materia" element={<SubjectForm />} />
        <Route path="materias" element={<SubjectList />} />

        {/* Reportes */}
        <Route path="/admin/reports" element={<ReportsPage />} />
        <Route path="profesores/materias" element={< TeacherAssigment/>} />
       <Route path="/admin/register-materia" element={<SubjectForm />} />
        <Route path="/admin/materias" element={<SubjectList />} />
        <Route path="/admin/reports/subject-grades" element={<GradeSubject />} />
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
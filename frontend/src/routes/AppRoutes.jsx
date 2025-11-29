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
import TeacherStudentListPage from "../pages/TeacherStudentList.jsx";
import ReportsPage from "../pages/ReportsPage.jsx";
import IndividualReport from "../components/students/IndividualReport";
import GradeSubject from "../pages/GradeSubjectReportAdmin.jsx";
import TeacherAssignGrade from "../pages/TeacherAssignGrade.jsx";
import AssignStudents from "../pages/AssignmentPage.jsx";
import TeacherAssigment from "../pages/TeacherAssigment.jsx";
import TeacherStatsSubjects from "../pages/TeacherStatsSubject.jsx";
import TeacherSummaryReport from "../pages/TeacherSummaryReport.jsx";
import TeacherProfile from "../pages/TeacherProfile";
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
      <Route path="/profesor" element={<TeacherLayout />}>
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="materias" element={<TeacherSubjects />} />
        <Route path="materias/:id/alumnos" element={<TeacherStudents />} />
        <Route path="calificaciones" element={<TeacherGrades />} />
        <Route path="reportes" element={<TeacherReports />} />
        <Route path="perfil" element={<TeacherProfile />} />
        <Route path="/profesor/alumnos" element ={<TeacherStudentListPage />} />
        <Route path="/profesor/calificaciones/capturar" element ={<TeacherAssignGrade />} />
        <Route path="/profesor/reportes/materia" element ={<TeacherStatsSubjects />} />
        <Route path="/profesor/reportes/resumen" element ={<TeacherSummaryReport />} />
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
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getTeacherSubjectLoad } from "../api/subject.ap.js";
import { getGradesBySubject } from "../api/grades.api";
import { Users, BookOpen, ClipboardList, TrendingUp } from "lucide-react";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSubjects: 0,
    totalStudents: 0,
    pendingGrades: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const subjectsData = await getTeacherSubjectLoad();
        setSubjects(subjectsData || []);
        
        let totalPending = 0;
        
        const gradesPromises = subjectsData.map(subject => 
            getGradesBySubject(subject.id).catch(() => ([]))
        );

        const allGrades = await Promise.all(gradesPromises);

        subjectsData.forEach((subject, index) => {
            const enrolledStudents = subject.students || [];
            const gradesForSubject = allGrades[index] || [];
            
            const studentsGradedIds = new Set(gradesForSubject.map(g => g.student_id));
            
            const pendingForSubject = enrolledStudents.length - studentsGradedIds.size;
            totalPending += pendingForSubject;
        });

        setStats({
          totalSubjects: subjectsData?.length || 0,
          totalStudents: subjectsData?.reduce((acc, s) => acc + (s.student_count || 0), 0) || 0,
          pendingGrades: totalPending,
        });
      } catch (err) {
        console.error("Error cargando dashboard o notas pendientes:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-azulF">
          Bienvenido, {user?.full_name}
        </h1>
        <p className="text-grisF mt-2">
          Panel de control para gestionar tus materias y calificaciones
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-grisF font-medium">Mis Materias</p>
              <h2 className="text-4xl font-bold text-azulF mt-2">
                {stats.totalSubjects}
              </h2>
            </div>
            <div className="w-12 h-12 bg-azulC/10 rounded-full flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-azulM" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-grisF font-medium">Total Alumnos</p>
              <h2 className="text-4xl font-bold text-azulF mt-2">
                {stats.totalStudents}
              </h2>
            </div>
            <div className="w-12 h-12 bg-azulC/10 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-azulM" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-grisF font-medium">Calificaciones Pendientes</p>
              <h2 className="text-4xl font-bold text-red-600 mt-2">
                {stats.pendingGrades}
              </h2>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <ClipboardList className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border mb-8">
        <h2 className="text-xl font-semibold text-azulF mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/profesor/calificaciones/capturar"
            className="p-4 bg-azulF text-white rounded-lg hover:bg-azulM transition text-center font-medium flex items-center justify-center gap-2"
          >
             <ClipboardList size={20} /> Capturar Calificaciones
          </a>
          <a
            href="/profesor/alumnos"
            className="p-4 bg-azulF text-white rounded-lg hover:bg-azulM transition text-center font-medium flex items-center justify-center gap-2"
          >
             <Users size={20} /> Ver Alumnos
          </a>
          <a
            href="/profesor/reportes/materia"
            className="p-4 bg-azulF text-white rounded-lg hover:bg-azulM transition text-center font-medium flex items-center justify-center gap-2"
          >
             <TrendingUp size={20} /> Ver Reportes
          </a>
        </div>
      </div>

<div className="bg-white p-6 rounded-xl shadow border mb-8">
  <h2 className="text-xl font-semibold text-azulF mb-4">Mis Materias</h2>

  {subjects.length === 0 ? (
    <p className="text-grisF">No tienes materias asignadas.</p>
  ) : (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
          <thead>
              <tr className="bg-gray-100 text-left border-b">
                  <th className="p-3 text-left font-semibold text-gray-700">Materia</th>
                  <th className="p-3 text-center font-semibold text-gray-700 w-40">Alumnos Inscritos</th>
              </tr>
          </thead>
          <tbody>
              {subjects.map((subject) => (
                  <tr key={subject.id} className="hover:bg-gray-50 border-b">
                      <td className="p-3 font-medium text-azulF">
                          {subject.name}
                      </td>
                      <td className="p-3 text-center text-gray-700 font-bold">
                          {subject.student_count}
                      </td>
                  </tr>
              ))}
          </tbody>
      </table>
    </div>
  )}
</div>

    </div>
  );
}
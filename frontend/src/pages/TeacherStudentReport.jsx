import React, { useState, useEffect } from "react";
import { Search, User, BookOpen, TrendingUp, Award, X } from "lucide-react";
import ActionStatusModal from "../components/ui/ActionStatusModal.jsx";

export default function StudentReportView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentReport, setStudentReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [statusModal, setStatusModal] = useState(null);

  // Buscar sugerencias de estudiantes
  useEffect(() => {
    const searchStudents = async () => {
      if (searchTerm.length < 2) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(
        `/api/v1/students/search-my-students?q=${encodeURIComponent(searchTerm)}`,  // ← Cambiar aquí
     {
      headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
          setShowDropdown(data.length > 0);
        }
      } catch (err) {
        console.error("Error al buscar estudiantes:", err);
        setStatusModal({ 
          status: 'error', 
          message: `Error al buscar: ${err.message}` 
        });
      }
    };

    const debounceTimer = setTimeout(searchStudents, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Cargar reporte completo del alumno
const loadStudentReport = async (studentId) => {
  setLoading(true);
  try {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`http://localhost:8000/api/v1/reports/student-full/${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      
      // ← AGREGA ESTOS LOGS
      console.log("📦 Datos completos:", data);
      console.log("📚 Materias recibidas:", data.subjects);
      console.log("📝 Calificaciones recibidas:", data.grades);
      
      setStudentReport(data);
    } else {
      setStatusModal({ 
        status: 'error', 
        message: 'Error al cargar el reporte del alumno' 
      });
    }
  } catch (err) {
    console.error("Error al cargar reporte:", err);
    setStatusModal({ 
      status: 'error', 
      message: `Error: ${err.message}` 
    });
  } finally {
    setLoading(false);
  }
};

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setSearchTerm(`${student.first_name} ${student.last_name}`);
    setShowDropdown(false);
    loadStudentReport(student.id);
  };

  const handleClearSelection = () => {
    setSelectedStudent(null);
    setStudentReport(null);
    setSearchTerm("");
  };

  // Calcular promedio general
  const calculateGeneralAverage = () => {
    if (!studentReport?.grades || studentReport.grades.length === 0) return 0;
    
    const sum = studentReport.grades.reduce((acc, grade) => acc + grade.score, 0);
    return (sum / studentReport.grades.length).toFixed(2);
  };

  // Determinar color según calificación
  const getGradeColor = (score) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 70) return "text-blue-600 bg-blue-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  // Determinar estado del promedio
  const getAverageStatus = (avg) => {
    if (avg >= 90) return { label: "Excelente", color: "text-green-600" };
    if (avg >= 80) return { label: "Muy Bien", color: "text-blue-600" };
    if (avg >= 70) return { label: "Bien", color: "text-yellow-600" };
    if (avg >= 60) return { label: "Suficiente", color: "text-orange-600" };
    return { label: "Insuficiente", color: "text-red-600" };
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-azulF mb-2">Reporte por Alumno</h1>
        <p className="text-grisF">
          Busca un alumno para ver su historial académico completo
        </p>
      </div>

      {/* Buscador */}
      <div className="bg-white rounded-xl shadow border p-6 mb-6">
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, apellido o email del alumno..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-azulM focus:border-azulM outline-none transition"
              />
            </div>
            {selectedStudent && (
              <button
                onClick={handleClearSelection}
                className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                title="Limpiar búsqueda"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Dropdown de resultados */}
          {showDropdown && (
            <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-64 overflow-y-auto">
              {searchResults.map((student) => (
                <button
                  key={student.id}
                  onClick={() => handleSelectStudent(student)}
                  className="w-full text-left px-4 py-3 hover:bg-azulF/10 transition border-b border-gray-100 last:border-0"
                >
                  <p className="font-semibold text-azulF">
                    {student.first_name} {student.last_name} {student.last_name2}
                  </p>
                  <p className="text-sm text-gray-500">{student.email}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reporte del alumno */}
      {loading ? (
        <div className="bg-white rounded-xl shadow border p-12 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-azulC border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando reporte del alumno...</p>
        </div>
      ) : studentReport && selectedStudent ? (
        <div className="space-y-6">
          {/* Información del alumno */}
          <div className="bg-gradient-to-r from-azulF to-azulM text-white rounded-xl shadow border p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {selectedStudent.first_name} {selectedStudent.last_name}{" "}
                    {selectedStudent.last_name2}
                  </h2>
                  <p className="text-white/80">{selectedStudent.email}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/80 text-sm">ID del Alumno</p>
                <p className="text-2xl font-bold">#{selectedStudent.id}</p>
              </div>
            </div>
          </div>

          {/* Estadísticas generales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow border p-6">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-6 h-6 text-azulC" />
                <p className="text-gray-600 font-medium">Materias Inscritas</p>
              </div>
              <p className="text-3xl font-bold text-azulF">
                {studentReport.subjects?.length || 0}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow border p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <p className="text-gray-600 font-medium">Promedio General</p>
              </div>
              <p className="text-3xl font-bold text-azulF">
                {calculateGeneralAverage()}
              </p>
              <p
                className={`text-sm font-semibold mt-1 ${
                  getAverageStatus(calculateGeneralAverage()).color
                }`}
              >
                {getAverageStatus(calculateGeneralAverage()).label}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow border p-6">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-6 h-6 text-yellow-600" />
                <p className="text-gray-600 font-medium">Calificaciones</p>
              </div>
              <p className="text-3xl font-bold text-azulF">
                {studentReport.grades?.length || 0}
              </p>
            </div>
          </div>

          {/* Materias y calificaciones */}
          <div className="bg-white rounded-xl shadow border p-6">
            <h3 className="text-xl font-bold text-azulF mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              Materias y Calificaciones
            </h3>

            {studentReport.subjects && studentReport.subjects.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-grisC text-left text-sm">
                      <th className="p-3 border border-grisM">Materia</th>
                      <th className="p-3 border border-grisM">Profesor</th>
                      <th className="p-3 border border-grisM text-center">Calificación</th>
                      <th className="p-3 border border-grisM text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentReport.subjects.map((subject) => {
                      const grade = studentReport.grades?.find(
                        (g) => g.subject_id === subject.id
                      );
                      const isApproved = grade && grade.score >= 70;

                      return (
                        <tr key={subject.id} className="hover:bg-gray-50">
                          <td className="p-3 border border-grisM font-semibold text-azulF">
                            {subject.name}
                          </td>
                          <td className="p-3 border border-grisM text-sm text-gray-600">
                            {subject.teacher?.full_name || "No asignado"}
                          </td>
                          <td className="p-3 border border-grisM text-center">
                            {grade ? (
                              <span
                                className={`inline-block px-4 py-2 rounded-lg font-bold text-lg ${getGradeColor(
                                  grade.score
                                )}`}
                              >
                                {grade.score}
                              </span>
                            ) : (
                              <span className="text-gray-400 italic">Sin calificar</span>
                            )}
                          </td>
                          <td className="p-3 border border-grisM text-center">
                            {grade ? (
                              isApproved ? (
                                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                  Aprobado
                                </span>
                              ) : (
                                <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                                  Reprobado
                                </span>
                              )
                            ) : (
                              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm">
                                Pendiente
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">El alumno no está inscrito en ninguna materia</p>
              </div>
            )}
          </div>
        </div>
      ) : !loading && (
        <div className="bg-white rounded-xl shadow border p-12 text-center">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            Busca un alumno para ver su reporte académico
          </p>
        </div>
      )}

      <ActionStatusModal
        status={statusModal ? statusModal.status : null}
        message={statusModal ? statusModal.message : ''}
        onClose={() => setStatusModal(null)}
      />
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { getSubjectsForTeacher } from "../api/grades.api";

export default function TeacherReportsPage() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    const loadSubjects = async () => {
      setLoading(true);
      try {
        const data = await getSubjectsForTeacher();
        setSubjects(data || []);
      } catch {
        setError("Error al cargar materias");
      } finally {
        setLoading(false);
      }
    };
    loadSubjects();
  }, []);

  // Calcular estadísticas cuando se selecciona materia
  useEffect(() => {
    if (selectedSubject) {
      const subject = subjects.find((s) => s.id === parseInt(selectedSubject));
      if (subject) {
        calculateStats(subject);
      }
    }
  }, [selectedSubject, subjects]);

  const calculateStats = (subject) => {
    const grades = subject.students
      ?.flatMap((s) => s.grades?.map((g) => g.grade) || [])
      .filter((g) => g !== null && g !== undefined) || [];

    if (grades.length === 0) {
      setReportData(null);
      return;
    }

    const average = (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2);
    const highest = Math.max(...grades);
    const lowest = Math.min(...grades);
    const passing = grades.filter((g) => g >= 6).length;
    const failing = grades.filter((g) => g < 6).length;

    setReportData({
      totalStudents: subject.students?.length || 0,
      graded: grades.length,
      pending: (subject.students?.length || 0) - grades.length,
      average: parseFloat(average),
      highest,
      lowest,
      passing,
      failing,
      percentagePassing: ((passing / grades.length) * 100).toFixed(1),
      grades,
    });
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Cargando...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-azulF mb-2">Reportes</h1>
      <p className="text-grisF mb-6">
        Visualiza estadísticas y desempeño de tus alumnos
      </p>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Selector de Materia */}
      <div className="mb-6 bg-white p-6 rounded-xl shadow border">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Selecciona una materia
        </label>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-azulF focus:border-azulF"
        >
          <option value="">-- Elige una materia --</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>

      {/* Reportes */}
      {reportData ? (
        <>
          {/* Tarjetas de Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow border">
              <p className="text-sm text-gray-600">Promedio General</p>
              <h2 className="text-3xl font-bold text-azulF mt-2">
                {reportData.average}
              </h2>
              <p className="text-xs text-gray-500 mt-1">de 10</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border">
              <p className="text-sm text-gray-600">Calificación Máxima</p>
              <h2 className="text-3xl font-bold text-green-600 mt-2">
                {reportData.highest}
              </h2>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border">
              <p className="text-sm text-gray-600">Calificación Mínima</p>
              <h2 className="text-3xl font-bold text-red-600 mt-2">
                {reportData.lowest}
              </h2>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border">
              <p className="text-sm text-gray-600">% Aprobados</p>
              <h2 className="text-3xl font-bold text-azulF mt-2">
                {reportData.percentagePassing}%
              </h2>
            </div>
          </div>

          {/* Tabla de Resumen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow border">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Estado de Calificaciones
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Calificados:</span>
                  <span className="font-bold text-azulF">
                    {reportData.graded}/{reportData.totalStudents}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pendientes:</span>
                  <span className="font-bold text-yellow-600">
                    {reportData.pending}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow border">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Resultados
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Aprobados:</span>
                  <span className="font-bold text-green-600">
                    {reportData.passing}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Reprobados:</span>
                  <span className="font-bold text-red-600">
                    {reportData.failing}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow border">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Rango de Calificaciones
              </h3>
              <div className="space-y-2">
                <div className="text-sm">
                  <p className="text-gray-600">Excelente (9-10): <span className="font-bold text-azulF">{reportData.grades.filter((g) => g >= 9).length}</span></p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-600">Bueno (7-8): <span className="font-bold text-azulF">{reportData.grades.filter((g) => g >= 7 && g < 9).length}</span></p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-600">Regular (6-6.9): <span className="font-bold text-yellow-600">{reportData.grades.filter((g) => g >= 6 && g < 7).length}</span></p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-600">Insuficiente (&lt;6): <span className="font-bold text-red-600">{reportData.grades.filter((g) => g < 6).length}</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Botón de Descarga */}
          <div className="flex justify-end">
            <button
              onClick={() => {
                // TODO: Implementar descarga de reporte
                alert("Funcionalidad de descarga en desarrollo");
              }}
              className="px-6 py-2 bg-azulM text-white rounded-lg hover:bg-azulF transition"
            >
              📥 Descargar Reporte
            </button>
          </div>
        </>
      ) : selectedSubject ? (
        <div className="bg-white p-8 rounded-xl shadow border text-center text-gray-500">
          No hay calificaciones registradas para esta materia
        </div>
      ) : (
        <div className="bg-white p-8 rounded-xl shadow border text-center text-gray-500">
          Selecciona una materia para ver reportes
        </div>
      )}
    </div>
  );
}
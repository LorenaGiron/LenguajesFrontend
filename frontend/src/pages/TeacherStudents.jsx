import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getStudentsBySubject } from "../api/grades.api";

export default function TeacherStudentsPage() {
  const { id: subjectId } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getStudentsBySubject(subjectId);
        setStudents(data || []);
      } catch (err) {
        setError(err.message || "Error al cargar alumnos");
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, [subjectId]);

  const filteredStudents = students.filter((student) => {
    const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Cargando alumnos...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-red-100 text-red-700 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-azulF mb-2">Alumnos de la Materia</h1>
      <p className="text-grisF mb-6">
        Lista de alumnos inscritos en esta materia
      </p>

      {/* Filtros */}
      <div className="mb-6 flex gap-4 flex-wrap">
        {/* Búsqueda */}
        <div className="relative flex-1 min-w-72">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-azulF focus:border-azulF"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla de Alumnos */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm
              ? "No se encontraron alumnos con ese nombre"
              : "No tienes alumnos asignados"}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-left border-b">
                <th className="p-4 font-semibold text-gray-700">Nombre</th>
                <th className="p-4 font-semibold text-gray-700">Email</th>
                <th className="p-4 font-semibold text-gray-700">Materias</th>
                <th className="p-4 font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {student.first_name} {student.last_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        ID: {student.enrollment_code || student.id}
                      </p>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{student.email}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {student.subjects?.slice(0, 2).map((s) => (
                        <span
                          key={s.id}
                          className="px-2 py-1 bg-azulC/10 text-azulC text-xs rounded"
                        >
                          {s.name}
                        </span>
                      ))}
                      {student.subjects?.length > 2 && (
                        <span className="px-2 py-1 text-xs text-gray-500">
                          +{student.subjects.length - 2} más
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() =>
                        (window.location.href = `/profesor/alumnos/${student.id}/calificaciones`)
                      }
                      className="px-3 py-1 bg-azulM text-white text-sm rounded hover:bg-azulF transition"
                    >
                      Ver Notas
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
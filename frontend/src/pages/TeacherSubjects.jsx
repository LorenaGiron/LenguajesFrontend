import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getTeacherSubjectLoad } from "../api/subject.ap.js";
import { BookOpen } from "lucide-react";

export default function AdminMaterias() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const subjectsData = await getTeacherSubjectLoad();
        setSubjects(subjectsData || []);
      } catch (err) {
        console.error("Error cargando materias:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Cargando materias...</p>
      </div>
    );
  }

  return (
    <div className="p-8">

      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-azulF mb-2 flex items-center gap-3">
          <BookOpen size={28} /> Mis Materia
        </h1>
        <p className="text-grisF mt-2">
          Consulta las materias registradas en el sistema.
        </p>
      </div>

      {/* LISTADO DE MATERIAS */}
      <div className="bg-white p-6 rounded-xl shadow border mb-8">
        <h2 className="text-xl font-semibold text-azulF mb-4">Listado de Materias</h2>

        {subjects.length === 0 ? (
          <p className="text-grisF">No hay materias registradas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-grisM">
              <thead>
                <tr className="bg-gray-100 border-b border-grisM">
                  <th className="p-3 text-left font-semibold text-gray-700 border-r border-grisM">
                    Materia
                  </th>
                  <th className="p-3 text-center font-semibold text-gray-700 border-grisM">
                    Alumnos Inscritos
                  </th>
                </tr>
              </thead>

              <tbody>
                {subjects.map((subject) => (
                  <tr
                    key={subject.id}
                    className="border-b border-grisM hover:bg-grisC transition"
                  >
                    <td className="p-3 font-medium text-azulF border-r border-grisM">
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

import { useState, useEffect } from "react";
import http from "../../api/http";
import Button from "../ui/Button";

export default function CalificacionesPorMateria() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);

  // Obtener materias del backend
  useEffect(() => {
    http
      .get("/v1/subjects/")
      .then((res) => setSubjects(res.data))
      .catch(() => alert("Error cargando materias"));
  }, []);

  // Obtener calificaciones por materia
  const fetchGrades = async () => {
    if (!selectedSubject) return;

    setLoading(true);
    try {
      const res = await http.get(`/v1/grades/by-subject/${selectedSubject}`);
      setGrades(res.data);
    } catch (error) {
      console.error(error);
      alert("No se pudieron cargar las calificaciones");
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <div className="p-4 border rounded-lg shadow bg-white">
        <label className="font-semibold text-gray-700">Materias disponibles:</label>
        <select
          className="w-full border p-2 rounded mt-2"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="">-- Seleccionar --</option>
          {subjects.map((subj) => (
            <option key={subj.id} value={subj.id}>
              {subj.name} — Prof. {subj.teacher.full_name}
            </option>
          ))}
        </select>

        <Button
          onClick={fetchGrades}
          className="mt-4"
        >
          Buscar
        </Button>
      </div>

      {/* Tabla de resultados */}
      <div className="p-4 border rounded-lg shadow bg-white">
        <div>
          {loading ? (
            <p>Cargando...</p>
          ) : grades.length === 0 ? (
            <p className="text-gray-600">No hay calificaciones registradas.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Alumno</th>
                  <th className="p-2 border">Calificación</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((g) => (
                  <tr key={g.id}>
                    <td className="border p-2">{g.student.full_name}</td>
                    <td className="border p-2">{g.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

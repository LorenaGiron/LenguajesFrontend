import React, { useEffect, useState } from "react";
import { getSubjectsForTeacher, getStudentsBySubject, createGrade } from "../api/grades.api.js";

export default function TeacherGrades() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [gradeValue, setGradeValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const data = await getSubjectsForTeacher();
        setSubjects(data || []);
      } catch (err) {
        console.error("Error al cargar materias:", err);
      }
    };
    loadSubjects();
  }, []);

  useEffect(() => {
    const loadStudents = async () => {
      if (!selectedSubject) {
        setStudents([]);
        return;
      }
      setLoading(true);
      try {
        const data = await getStudentsBySubject(selectedSubject);
        setStudents(data || []);
      } catch (err) {
        console.error("Error al cargar alumnos:", err);
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, [selectedSubject]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSubject || !selectedStudent) {
      setStatus({ type: "error", message: "Selecciona materia y alumno." });
      return;
    }
    try {
      await createGrade({ subject_id: selectedSubject, student_id: selectedStudent, value: gradeValue });
      setStatus({ type: "success", message: "✓ Calificación registrada correctamente." });
      setGradeValue(0);
      setSelectedStudent("");
    } catch (err) {
      setStatus({ type: "error", message: `Error: ${err.message}` });
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-azulF mb-2">Captura de Calificaciones</h1>
      <p className="text-grisF mb-6">Registra las calificaciones de tus alumnos en las materias que impartes.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow border border-gray-200 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Materia</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-azulC focus:border-azulC"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="">-- Selecciona una materia --</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name || s.nombre || "Materia"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Alumno</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-azulC focus:border-azulC disabled:bg-gray-100"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                disabled={!selectedSubject || loading}
              >
                <option value="">-- Selecciona un alumno --</option>
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.first_name} {st.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Calificación (0-100)</label>
              <input
                type="number"
                min="0"
                max="100"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-azulC focus:border-azulC"
                value={gradeValue}
                onChange={(e) => setGradeValue(parseInt(e.target.value) || 0)}
              />
            </div>

            {status && (
              <div className={`p-3 rounded-lg text-sm ${status.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {status.message}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-azulC text-white font-semibold rounded-lg hover:bg-azulF transition"
            >
              Registrar Calificación
            </button>
          </form>
        </div>

        {/* Lista de Alumnos */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl shadow border border-gray-200">
            <h2 className="text-xl font-semibold text-azulF mb-4">
              {selectedSubject ? "Alumnos de la materia" : "Selecciona una materia para ver alumnos"}
            </h2>

            {selectedSubject && students.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay alumnos inscritos en esta materia.</p>
            ) : selectedSubject ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 text-left font-semibold text-gray-700 border-b">ID</th>
                      <th className="p-3 text-left font-semibold text-gray-700 border-b">Nombre</th>
                      <th className="p-3 text-left font-semibold text-gray-700 border-b">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((st) => (
                      <tr key={st.id} className="hover:bg-gray-50 border-b">
                        <td className="p-3">{st.id}</td>
                        <td className="p-3">{st.first_name} {st.last_name}</td>
                        <td className="p-3 text-gray-600">{st.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">Elige una materia arriba</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

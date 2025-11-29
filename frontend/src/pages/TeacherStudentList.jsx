import React, { useState, useEffect } from "react";
import { Users, Download, ClipboardList } from "lucide-react";
import { getTeacherSubjectLoad } from "../api/subject.ap.js";
import { getStudentsBySubject } from "../api/grades.api";

// Componente principal para la lista de alumnos del profesor
export default function TeacherStudentListPage() {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState("");
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadSubjects = async () => {
            try {
                // Llama a /api/v1/subjects/teacher-load/
                const data = await getTeacherSubjectLoad(); 
                setSubjects(data);
                if (data.length > 0) {
                    setSelectedSubjectId(data[0].id.toString());
                } else {
                    setLoading(false);
                }
            } catch (err) {
                setError("Error al cargar las materias del profesor: " + err.message);
                setLoading(false);
            }
        };
        loadSubjects();
    }, []);

    useEffect(() => {
        if (!selectedSubjectId) {
            setStudents([]);
            setLoading(false);
            return;
        }

        const loadStudents = async () => {
            setLoading(true);
            setError(null);
            setStudents([]);
            try {
                const data = await getStudentsBySubject(selectedSubjectId); 
                setStudents(data);
            } catch (err) {
                setError("Error al cargar los alumnos de la materia: " + err.message);
            } finally {
                setLoading(false);
            }
        };
        loadStudents();
    }, [selectedSubjectId]);
    
    const handleExportCSV = () => {
        if (students.length === 0) {
            alert("No hay alumnos para exportar.");
            return;
        }

        const currentSubject = subjects.find(s => s.id.toString() === selectedSubjectId);
        const subjectName = currentSubject?.name || "Desconocida";
        
        const headers = ["ID_Alumno", "Nombre_Completo", "Email", "Materia_Asignada"];
        let csvContent = headers.join(";") + "\n";

        students.forEach(student => {
            const fullName = `${student.first_name} ${student.last_name} ${student.last_name2 || ''}`.trim();
            const row = [
                student.id,
                `"${fullName.replace(/"/g, '""')}"`,
                student.email,
                `"${subjectName.replace(/"/g, '""')}"`
            ];
            csvContent += row.join(";") + "\n";
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        const safeSubjectName = subjectName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        link.setAttribute('href', url);
        link.setAttribute('download', `Alumnos_${safeSubjectName}.csv`);
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const currentSubjectName = subjects.find(s => s.id.toString() === selectedSubjectId)?.name || 'Selecciona una materia';

    return (
        <div className="p-8">
            <h1 className="text-3xl font-semibold text-azulF mb-2 flex items-center gap-3">
                <Users size={28} /> Alumnos por Materia
            </h1>
            <p className="text-grisF mb-6">
                Consulta los alumnos inscritos en tus materias y exporta la lista.
            </p>
            
            {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg mb-4">{error}</div>}

            <div className="bg-white p-6 rounded-xl shadow border">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 border-b pb-4 gap-4 md:gap-0">
                    
                    <div className="w-full md:w-1/3 min-w-80">
                        <label htmlFor="subject-select" className="block text-sm font-medium text-grisF mb-2">
                            Filtrar por Materia:
                        </label>
                        <select
                            id="subject-select"
                            value={selectedSubjectId}
                            onChange={(e) => setSelectedSubjectId(e.target.value)}
                            className="w-full p-2 border border-grisC rounded-lg focus:ring-azulM focus:border-azulM"
                            disabled={subjects.length === 0 || loading}
                        >
                            {subjects.length === 0 && <option value="">-- No tienes materias asignadas --</option>}
                            {subjects.map((subj) => (
                                <option key={subj.id} value={subj.id}>
                                    {subj.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={handleExportCSV}
                        className={`flex items-center text-sm px-4 py-2 rounded-lg transition duration-150 text-white ${
                                (students.length > 0 && selectedSubjectId) ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
                            }`}
                        disabled={students.length === 0 || !selectedSubjectId}
                    >
                        <Download size={18} className="mr-2" />
                        Exportar a CSV
                    </button>
                </div>

                {/* Título y Tabla de Alumnos */}
                <h2 className="text-xl font-semibold text-azulF mb-4">
                    Lista de Alumnos en: <span className="text-grisF">{currentSubjectName}</span>
                </h2>

                <StudentTable 
                    students={students} 
                    loading={loading} 
                    subjectId={selectedSubjectId}
                />
            </div>
        </div>
    );
}

function StudentTable({ students, loading, subjectId }) {
    
    if (loading) return <div className="text-center p-6 text-gray-500">Cargando lista de alumnos...</div>;

    if (!subjectId) return (
         <p className="text-center p-6 text-gray-500 italic">
            Selecciona una materia para ver su lista de alumnos.
        </p>
    );

    if (students.length === 0) return (
        <p className="text-center p-6 text-gray-500 italic">
            No hay alumnos inscritos en esta materia.
        </p>
    );

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
                <thead>
                    <tr className="bg-grisC text-left text-sm">
                        <th className="p-3 border border-grisM w-1/12">ID</th>
                        <th className="p-3 border border-grisM w-4/12">Nombre Completo</th>
                        <th className="p-3 border border-grisM w-7/12">Correo</th>
                       
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.id} className="hover:bg-grisC">
                            <td className="p-3 border border-grisM text-sm whitespace-nowrap">{student.id}</td>
                            <td className="p-3 border border-grisM text-sm whitespace-nowrap">
                                {student.first_name} {student.last_name} {student.last_name2}
                            </td>
                            <td className="p-3 border border-grisM text-sm break-words">{student.email}</td>
                         
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
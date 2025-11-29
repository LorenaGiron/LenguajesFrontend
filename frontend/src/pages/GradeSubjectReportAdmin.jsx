import React, { useState, useEffect } from "react";
import { BookOpen, User, Download } from "lucide-react";
import { getSubjects, getSubjectGradesReport } from "../api/subject.ap.js"; 

export default function SubjectGradesReport() {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [average, setAverage] = useState(null);

    useEffect(() => {
        const loadSubjects = async () => {
            try {
                const data = await getSubjects(); 
                setSubjects(data);
            } catch (err) {
                setError("Error al cargar la lista de materias.");
            }
        };
        loadSubjects();
    }, []);

    useEffect(() => {
        if (!selectedSubjectId) {
            setReportData(null);
            setAverage(null);
            return;
        }

        const loadReport = async () => {
            setLoading(true);
            setError(null);
            setReportData(null);
            setAverage(null);
            try {
                const data = await getSubjectGradesReport(selectedSubjectId);
                setReportData(data);
                
                const scores = data.students_with_grades.map(s => s.score);
                if (scores.length > 0) {
                    const sum = scores.reduce((a, b) => a + b, 0);
                    const avg = (sum / scores.length).toFixed(2);
                    setAverage(avg);
                } else {
                    setAverage(0);
                }

            } catch (err) {
                setError("Error al cargar el reporte de calificaciones.");
            } finally {
                setLoading(false);
            }
        };
        loadReport();
    }, [selectedSubjectId]);

    const handleSelectChange = (e) => {
        setSelectedSubjectId(e.target.value);
    };

    const handleExportCSV = () => {
        if (!reportData || reportData.students_with_grades.length === 0) {
            alert("No hay datos para exportar.");
            return;
        }

        const subjectName = reportData.subject_name;
        const headers = ["ID_Alumno", "Nombre_Alumno", "Calificacion"];
        let csvContent = headers.join(";") + "\n";

        reportData.students_with_grades.forEach(studentGrade => {
            const row = [
                studentGrade.student_id,
                `"${studentGrade.student_name.replace(/"/g, '""')}"`,
                studentGrade.score.toString().replace('.', ',') 
            ];
            csvContent += row.join(";") + "\n";
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const safeSubjectName = subjectName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        
        link.setAttribute('href', url);
        link.setAttribute('download', `Reporte_Notas_${safeSubjectName}.csv`);
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const currentSubjectName = subjects.find(s => String(s.id) === selectedSubjectId)?.name || 'Selecciona una materia';

    return (
        <div className="bg-white p-6 rounded-xl shadow border">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h2 className="text-2xl font-semibold text-azulF flex items-center gap-2">
                    <BookOpen size={24} /> Reporte de Calificaciones por Materia
                </h2>

                <button
                    onClick={handleExportCSV}
                    className={`flex items-center text-sm px-3 py-2 rounded-lg transition duration-150 
                                ${reportData?.students_with_grades.length > 0 ? 
                                'bg-green-600 text-white hover:bg-green-700' :
                                'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                    disabled={!reportData || reportData.students_with_grades.length === 0}
                >
                    <Download size={18} className="mr-1" />
                    Exportar CSV
                </button>
            </div>

            <div className="mb-6">
                <label htmlFor="subject-select" className="block text-sm font-medium text-grisF mb-2">
                    Seleccionar Materia:
                </label>
                <select
                    id="subject-select"
                    value={selectedSubjectId}
                    onChange={handleSelectChange}
                    className="w-full md:w-1/2 p-3 border border-grisM rounded-lg focus:ring-azulM focus:border-azulM"
                    disabled={subjects.length === 0}
                >
                    <option value="">-- Selecciona una Materia --</option>
                    {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                            {subject.name} (Prof: {subject.teacher?.full_name || 'N/A'})
                        </option>
                    ))}
                </select>
            </div>
            
            {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg mb-4">{error}</div>}
            
            {selectedSubjectId ? (
                <div className="mt-4">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-medium text-grisF">
                            Alumnos en: <span className="font-bold text-azulF">{currentSubjectName}</span>
                        </h3>
                        {average !== null && (
                             <div className="bg-grisC p-2 rounded-md border text-sm font-semibold">
                                Promedio del grupo: <span className="text-red-600">{average}</span>
                            </div>
                        )}
                    </div>

                    {loading ? (
                        <div className="text-center p-6 text-gray-500">Cargando lista de alumnos y notas...</div>
                    ) : (
                        <table className="min-w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="p-2 border border-gray-300 w-16">ID</th>
                                    <th className="p-2 border border-gray-300">Nombre del Alumno</th>
                                    <th className="p-2 border border-gray-300 text-center w-40">Calificación</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData?.students_with_grades.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="p-4 text-center text-gray-500 italic">
                                            No hay calificaciones registradas para esta materia.
                                        </td>
                                    </tr>
                                ) : (
                                    reportData?.students_with_grades.map((studentGrade) => (
                                        <tr key={studentGrade.grade_id} className="hover:bg-gray-50">
                                            <td className="p-2 border border-gray-300">{studentGrade.student_id}</td>
                                            <td className="p-2 border border-gray-300 flex items-center gap-2">
                                                <User size={16} className="text-azulF" />
                                                {studentGrade.student_name}
                                            </td>
                                            <td className="p-2 border border-gray-300 text-center font-bold text-red-600">
                                                {studentGrade.score}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            ) : (
                <p className="p-4 text-gray-500 italic">Selecciona una materia para ver su reporte de calificaciones.</p>
            )}
        </div>
    );
}
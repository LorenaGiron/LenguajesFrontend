import React, { useState, useEffect, useCallback } from "react";
import { getTeacherSubjectLoad } from "../api/subject.ap.js";
import { 
    getStudentsBySubject, 
    getGradesBySubject, 
    createGrade, 
    updateGrade 
} from "../api/grades.api.js";
import Button from "../components/ui/Button";
import ActionStatusModal from "../components/ui/ActionStatusModal.jsx";
import { User, BookOpen, ClipboardList, Edit2, X, Check, Download } from "lucide-react"; 

export default function TeacherGradesCapturePage() {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState("");
    const [studentsData, setStudentsData] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [statusModal, setStatusModal] = useState(null);
    const [editingStudentId, setEditingStudentId] = useState(null);
    const [tempScore, setTempScore] = useState("");

    const loadStudentsAndGrades = useCallback(async (subjectId) => {
        if (!subjectId) return;

        setLoading(true);
        try {
            const studentsList = await getStudentsBySubject(subjectId);
            const gradesList = await getGradesBySubject(subjectId);

            const existingGradesMap = gradesList.reduce((acc, grade) => {
                acc[grade.student_id] = { score: grade.score, id: grade.id };
                return acc;
            }, {});

            const combinedData = studentsList.map(student => ({
                id: student.id,
                first_name: student.first_name,
                last_name: student.last_name,
                score: existingGradesMap[student.id]?.score ?? null, 
                gradeId: existingGradesMap[student.id]?.id ?? null,
            }));

            setStudentsData(combinedData);
            setEditingStudentId(null); 

        } catch (error) {
            setStatusModal({ status: 'error', message: `Error al cargar datos: ${error.message}` });
            setStudentsData([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const loadSubjects = async () => {
            try {
                const data = await getTeacherSubjectLoad();
                setSubjects(data || []);
                if (data.length > 0) {
                    setSelectedSubjectId(data[0].id.toString());
                }
            } catch (err) {
                setStatusModal({ status: 'error', message: `Error al cargar materias: ${err.message}` });
            } finally {
                setLoading(false);
            }
        };
        loadSubjects();
    }, []);

    useEffect(() => {
        loadStudentsAndGrades(selectedSubjectId);
    }, [selectedSubjectId, loadStudentsAndGrades]);

    const startEditing = (student) => {
        setEditingStudentId(student.id);
        setTempScore(student.score !== null ? student.score : "");
    };

    const cancelEditing = () => {
        setEditingStudentId(null);
        setTempScore("");
    };

    const handleSaveSingleRow = async (student) => {
        const scoreValue = tempScore === "" ? null : parseFloat(tempScore);

        if (scoreValue !== null && (scoreValue < 0 || scoreValue > 100)) {
            setStatusModal({ status: 'error', message: 'La calificación debe estar entre 0 y 100' });
            return;
        }

        if (scoreValue === null) {
             setStatusModal({ status: 'error', message: 'Ingresa un valor válido o cancela' });
             return;
        }

        try {
            const gradeData = {
                student_id: student.id,
                subject_id: parseInt(selectedSubjectId),
                score: scoreValue,
            };

            if (student.gradeId) {
                await updateGrade(student.gradeId, { score: scoreValue }); 
            } else {
                await createGrade(gradeData);
            }

            setStatusModal({ status: 'success', message: 'Calificación guardada correctamente' });
            await loadStudentsAndGrades(selectedSubjectId); 
            
        } catch (error) {
            console.error(error);
            setStatusModal({ status: 'error', message: `Error al guardar: ${error.message}` });
        }
    };

    const handleDownloadCSV = () => {
        if (!studentsData.length) {
            setStatusModal({ status: 'error', message: 'No hay datos para exportar.' });
            return;
        }
        
        const headers = ["ID", "Nombre", "Apellido", "Calificación"];
        const rows = studentsData.map(student => [
            student.id,
            student.first_name,
            student.last_name,
            student.score !== null ? student.score : "N/A"
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `calificaciones_${currentSubjectName.replace(/\s+/g, '_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const currentSubjectName = subjects.find(s => s.id.toString() === selectedSubjectId)?.name || 'N/A';

    return (
        <div className="p-8">
            <h1 className="text-3xl font-semibold text-azulF mb-2 flex items-center gap-3">
                <ClipboardList size={28} /> Captura de Calificaciones
            </h1>
            <p className="text-grisF mb-6">
                Selecciona una materia y gestiona las calificaciones individuales.
            </p>

            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow border flex flex-col md:flex-row md:items-end gap-4 justify-between">
                    <div className="flex-1">
                        <label htmlFor="subject-select" className="block text-sm font-semibold text-grisF mb-2 flex items-center gap-1">
                            <BookOpen size={16}/> Selecciona la Materia:
                        </label>
                        <select
                            id="subject-select"
                            value={selectedSubjectId}
                            onChange={(e) => setSelectedSubjectId(e.target.value)}
                            className="w-full md:w-1/2 p-2 border border-grisC rounded-lg focus:ring-azulM focus:border-azulM"
                            disabled={subjects.length === 0 || loading}
                        >
                            <option value="">-- Elige una materia --</option>
                            {subjects.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <Button 
                        onClick={handleDownloadCSV}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 h-10"
                        title="Descargar reporte CSV"
                        disabled={studentsData.length === 0}
                    >
                        <Download size={18} />
                        <span>Descargar CSV</span>
                    </Button>
                </div>

                <div className="bg-white p-6 rounded-xl shadow border">
                    <h2 className="text-xl font-semibold text-azulF mb-4">
                        Calificaciones para: <span className="text-grisF">{currentSubjectName}</span>
                    </h2>

                    {loading && selectedSubjectId ? (
                        <p className="text-center p-6 text-gray-500">Cargando alumnos y notas...</p>
                    ) : studentsData.length === 0 && selectedSubjectId ? (
                        <p className="text-center p-6 text-gray-500 italic">No hay alumnos inscritos en esta materia.</p>
                    ) : selectedSubjectId === "" ? (
                         <p className="text-center p-6 text-gray-500 italic">Por favor, selecciona una materia.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse">
                                <thead>
                                    <tr className="bg-grisC text-left text-sm">
                                        <th className="p-3 border border-grisM w-1/12">ID</th>
                                        <th className="p-3 border border-grisM w-4/12">Alumno</th>
                                        <th className="p-3 border border-grisM w-2/12 text-center">Calificación</th>
                                        <th className="p-3 border border-grisM w-2/12 text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentsData.map((student) => {
                                        const isEditing = editingStudentId === student.id;
                                        const isApproved = student.score !== null && student.score >= 70;
                                        const scoreColorClass = student.score === null 
                                            ? 'text-gray-400'
                                            : isApproved 
                                                ? 'text-green-700 font-bold'
                                                : 'text-red-700 font-bold';

                                        return (
                                            <tr key={student.id} className="hover:bg-gray-50">
                                                <td className="p-3 border border-grisM text-sm text-gray-600">{student.id}</td>
                                                
                                                <td className="p-3 border border-grisM text-sm font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <User size={16} className="text-grisF" />
                                                        {student.first_name} {student.last_name}
                                                    </div>
                                                </td>

                                                <td className="p-3 border border-grisM text-center align-middle">
                                                    {isEditing ? (
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            autoFocus
                                                            value={tempScore}
                                                            onChange={(e) => setTempScore(e.target.value)}
                                                            className="w-24 p-1 border-2 border-azulM rounded text-center focus:outline-none font-bold text-gray-800"
                                                            placeholder="0-100"
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') handleSaveSingleRow(student);
                                                                if (e.key === 'Escape') cancelEditing();
                                                            }}
                                                        />
                                                    ) : (
                                                        <span className={`text-lg ${scoreColorClass}`}>
                                                            {student.score !== null ? student.score : 'N/A'}
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="p-3 border border-grisM text-center align-middle">
                                                    <div className="flex justify-center gap-2">
                                                        {isEditing ? (
                                                            <>
                                                                <Button 
                                                                    onClick={() => handleSaveSingleRow(student)}
                                                                    className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-md h-auto w-auto"
                                                                    title="Guardar"
                                                                >
                                                                    <Check size={18} />
                                                                </Button>
                                                                <Button 
                                                                    onClick={cancelEditing}
                                                                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md h-auto w-auto"
                                                                    title="Cancelar"
                                                                >
                                                                    <X size={18} />
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <Button 
                                                                onClick={() => startEditing(student)}
                                                                className="bg-azulF hover:bg-azulM text-white p-2 rounded-md h-auto w-auto flex items-center gap-2"
                                                                title="Editar Calificación"
                                                            >
                                                                <Edit2 size={16} /> <span>Editar</span>
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            
            <ActionStatusModal
                status={statusModal ? statusModal.status : null}
                message={statusModal ? statusModal.message : ''}
                onClose={() => setStatusModal(null)}
            />
        </div>
    );
}
import React, { useState, useEffect } from 'react';
import { getSubjects, assignStudentsToSubject, removeStudentFromSubject } from '../api/subject.ap.js';
import { getStudents } from '../api/students.api';
import AssignmentModal from '../components/subject/AssignmentModal';
import DeleteConfirmationModal from '../components/ui/DeleteConfirmationModal.jsx';
import ActionStatusModal from '../components/ui/ActionStatusModal.jsx';

export default function GlobalAssignmentPage() {

    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [subjectToAssign, setSubjectToAssign] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [reloadTrigger, setReloadTrigger] = useState(0);
    
    const [studentToRemove, setStudentToRemove] = useState(null);
    const [actionStatus, setActionStatus] = useState(null); 

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            const assigningSubjectId = subjectToAssign ? subjectToAssign.id : null;
            const selectedSubjectId = selectedSubject ? selectedSubject.id : null;

            try {
                const subjectsData = await getSubjects();
                const studentsData = await getStudents();

                setSubjects(subjectsData);
                setStudents(studentsData);

                if (assigningSubjectId !== null) {
                    const updatedSubject = subjectsData.find(s => s.id === assigningSubjectId);
                    if (updatedSubject) setSubjectToAssign(updatedSubject);
                }

                if (selectedSubjectId !== null) {
                    const updatedSelectedSubject = subjectsData.find(s => s.id === selectedSubjectId);
                    if (updatedSelectedSubject) setSelectedSubject(updatedSelectedSubject);
                }

            } catch (err) {
                setError("Error al cargar datos: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [reloadTrigger]);


    const handleSelectSubject = (subject) => {
        setSelectedSubject(subject);
    };

    const handleOpenAssignment = (subject) => {
        setSubjectToAssign(subject);
        setSelectedSubject(subject);
    };

    const handleAssignmentSuccess = (updatedSubjectData) => {
        setSubjects(prev =>
            prev.map(s =>
                s.id === updatedSubjectData.id ? updatedSubjectData : s
            )
        );

        setSelectedSubject(updatedSubjectData);
        setSubjectToAssign(updatedSubjectData);

        setReloadTrigger(prev => prev + 1);
    };

    const handleCloseModal = () => {
        setSubjectToAssign(null);
    };

    const handleRemoveRequest = (student) => {
        setStudentToRemove(student);
    };

    const confirmRemoval = async () => {
        if (!studentToRemove || !selectedSubject) return;

        const studentId = studentToRemove.id;
        const subjectId = selectedSubject.id;
        const studentName = `${studentToRemove.first_name} ${studentToRemove.last_name}`;
        const subjectName = selectedSubject.name;
        
        setStudentToRemove(null);

        try {
            const updatedSubject = await removeStudentFromSubject(subjectId, studentId);
            
            setSubjects(prev =>
                prev.map(s => (s.id === updatedSubject.id ? updatedSubject : s))
            );
            setSelectedSubject(updatedSubject);
            
            setActionStatus({ 
                status: 'success', 
                message: `El alumno '${studentName}' ha sido removido de la materia '${subjectName}' correctamente.`
                
            });

        } catch (err) {
            setActionStatus({ 
                status: 'error', 
                message: `No se pudo remover al alumno '${studentName}'. Causa: ${err.message}` 
            });
        }
    };


    const handleExportCSV = () => {
        if (!selectedSubject) {
            alert("Selecciona una materia para exportar.");
            return;
        }

        const subject = selectedSubject;

        const headers = [
            "ID Materia",
            "Materia",
            "Profesor",
            "ID Alumno",
            "Nombre Alumno",
            "Email Alumno"
        ];

        let csvContent = headers.join(";") + "\n";

        const subjectName = `"${subject.name.replace(/"/g, '""')}"`;
        const teacherName = `"${(subject.teacher?.full_name || 'N/A').replace(/"/g, '""')}"`;

        const students = subject.students && subject.students.length > 0
            ? subject.students
            : [{ id: '', first_name: 'Sin', last_name: 'Alumnos', email: '' }];

        students.forEach(student => {
            const studentFullName = `${student.first_name || ''} ${student.last_name || ''}`;

            const row = [
                subject.id,
                subjectName,
                teacherName,
                student.id,
                `"${studentFullName.trim().replace(/"/g, '""')}"`,
                student.email
            ];
            csvContent += row.join(";") + "\n";
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        const safeSubjectName = subject.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        link.setAttribute('href', url);
        link.setAttribute('download', `Asignacion_${safeSubjectName}.csv`);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    if (loading) return <div className="text-center p-8">Cargando datos...</div>;
    if (error) return <div className="p-4 bg-red-100 text-red-700">{error}</div>;


    return (
        <div className="p-8 max-w-7xl mx-auto">

            <div className="mb-6">
                <h1 className="text-3xl font-bold text-azulF">
                    Gestión y asignación de materias
                </h1>
            </div>

            <div className="grid grid-cols-2 gap-8">

                <div className="col-span-1 bg-white p-6 rounded-lg shadow-md border">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                        Materias Registradas
                    </h2>

                    <SubjectTable
                        subjects={subjects}
                        onSelect={handleSelectSubject}
                        onAssign={handleOpenAssignment}
                    />
                </div>


                <div className="col-span-1 bg-white p-6 rounded-lg shadow-md border">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h2 className="text-xl font-semibold">
                            Alumnos por materia seleccionada
                        </h2>

                        <button
                            onClick={handleExportCSV}
                            className={`flex items-center text-sm px-3 py-1 rounded-lg transition duration-150 
                                    ${selectedSubject ? 'bg-lime-700 text-white hover:bg-lime-600' :
                                    'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                            disabled={!selectedSubject}
                        >
                            Exportar CSV
                        </button>
                    </div>

                    {selectedSubject ? (
                        <AssignedStudentsTable
                            subject={selectedSubject}
                            students={selectedSubject.students || []}
                            onRemoveRequest={handleRemoveRequest}
                        />
                    ) : (
                        <p className="text-gray-500 italic">
                            Selecciona una materia para ver los alumnos asignados.
                        </p>
                    )}
                </div>
            </div>

            {subjectToAssign && (
                <AssignmentModal
                    subject={subjectToAssign}
                    allStudents={students}
                    currentStudents={subjectToAssign.students || []}
                    onClose={handleCloseModal}
                    onSuccess={handleAssignmentSuccess}
                    assignApi={assignStudentsToSubject}
                    onStatus={setActionStatus}
                />
            )}
            
            <DeleteConfirmationModal
                student={studentToRemove}
                onClose={() => setStudentToRemove(null)}
                onConfirm={confirmRemoval}
            />
            
            <ActionStatusModal
                status={actionStatus ? actionStatus.status : null}
                message={actionStatus ? actionStatus.message : ''}
                onClose={() => setActionStatus(null)}
            />

        </div>
    );
}


const SubjectTable = ({ subjects, onSelect, onAssign }) => (
    <table className="w-full border-collapse border border-grisM text-sm">
        <thead>
            <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Materia</th>
                <th className="p-2 border">Profesor</th>
                <th className="p-2 border w-20">Alumnos</th>
                <th className="p-2 border w-10">Acción</th>
            </tr>
        </thead>
        <tbody>
            {subjects.map(subject => (
                <tr key={subject.id} className="hover:bg-grisC">
                    <td className="p-2 border cursor-pointer"
                        onClick={() => onSelect(subject)}>
                        {subject.name}
                    </td>

                    <td className="p-2 border">
                        {subject.teacher?.full_name || 'N/A'}
                    </td>

                    <td className="p-2 border text-center">
                        {subject.student_count}
                    </td>

                    <td className="p-2 border text-center">
                        <button
                            onClick={() => onAssign(subject)}
                            className="bg-azulF text-white p-1 rounded-full hover:bg-azulM"
                        >
                            +
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);


const AssignedStudentsTable = ({ subject, students, onRemoveRequest }) => (
    <>
        <h3 className="text-lg font-semibold mb-3 text-azulF">
            Estudiantes en: {subject.name}
        </h3>

        <table className="w-full border-collapse text-sm">
            <thead>
                <tr className="bg-gray-100 text-left">
                    <th className="p-2 border">ID</th>
                    <th className="p-2 border">Nombre</th>
                    <th className="p-2 border">Email</th>
                    <th className="p-2 border w-10">Acción</th>
                </tr>
            </thead>

            <tbody>
                {students.length === 0 ? (
                    <tr>
                        <td colSpan="4" className="p-3 text-center text-gray-500 italic">
                            No hay alumnos asignados.
                        </td>
                    </tr>
                ) : (
                    students.map(student => (
                        <tr key={student.id} className="hover:bg-gray-50">
                            <td className="p-2 border">{student.id}</td>
                            <td className="p-2 border">
                                {student.first_name} {student.last_name}
                            </td>
                            <td className="p-2 border">{student.email}</td>

                            <td className="p-2 border text-center">
                                <button
                                    onClick={() => onRemoveRequest(student)}
                                    className="bg-red-700 text-white p-1 rounded-full hover:bg-red-600"
                                    title="Remover Alumno"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    </>
);
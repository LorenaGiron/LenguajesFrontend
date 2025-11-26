import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import StudentForm from "../components/students/StudentForm"; 
import EditStudentModal from "../components/students/EditStudentModal.jsx"; 
import DeleteConfirmationModal from "../components/students/DeleteConfirmationModal.jsx"; 
import ActionStatusModal from "../components/ui/ActionStatusModal.jsx"; // IMPORTAR
import { getStudents, deleteStudent } from "../api/students.api"; 

export default function StudentsPage() {
    const [params, setParams] = useSearchParams();
    const view = params.get("view") || "list";
    const [studentToEdit, setStudentToEdit] = useState(null); 
    const [studentToDelete, setStudentToDelete] = useState(null); 
    const [reloadList, setReloadList] = useState(false);
    
    const [actionStatus, setActionStatus] = useState(null); 

    const handleOpenEditModal = (student) => {
        setStudentToEdit(student); 
    };
    
    const handleFormClose = () => {
        setStudentToEdit(null); 
        setReloadList(prev => !prev);
    };
    
    const confirmDeletion = async () => {
        if (!studentToDelete) return;

        const { id, first_name, last_name } = studentToDelete;
        const studentName = `${first_name} ${last_name}`;

        try {
            await deleteStudent(id);
            
            // Mostrar modal de éxito
            setActionStatus({ status: 'success', message: `El alumno ${studentName} ha sido eliminado correctamente.` });
            
            setStudentToDelete(null); 
            setReloadList(prev => !prev);
        } catch (err) {
            // Mostrar modal de error, incluyendo el "Failed to fetch"
            setActionStatus({ status: 'error', message: `No se pudo completar la eliminación. Causa: ${err.message}` });
            
            setStudentToDelete(null); 
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-semibold text-azulF mb-4">
                {view === "list"
                    ? "Lista de alumnos"
                    : view === "register"
                    ? "Registrar alumno"
                    : "Asignar materias"}
            </h1>

            <p className="text-grisF mb-8">
                {view === "list" && "Consulta, busca, edita y gestiona los alumnos registrados."}
                {view === "register" && "Completa el formulario para registrar un nuevo alumno."}
                {view === "assign" && "Asigna materias a un alumno existente."}
            </p>

            {view === "list" && <StudentList 
                onEdit={handleOpenEditModal} 
                onDeleteRequest={setStudentToDelete}
                key={reloadList} 
            />}
            
            {view === "register" && <StudentForm onSuccess={handleFormClose} />}
            
            {view === "assign" && <AssignSubjects />} 
            
            <EditStudentModal 
                student={studentToEdit} 
                onClose={() => setStudentToEdit(null)} 
                onSuccess={handleFormClose} 
            />
            
            <DeleteConfirmationModal
                student={studentToDelete}
                onClose={() => setStudentToDelete(null)}
                onConfirm={confirmDeletion}
            />

            
            <ActionStatusModal
                status={actionStatus ? actionStatus.status : null}
                message={actionStatus ? actionStatus.message : ''}
                onClose={() => setActionStatus(null)}
            />
        </div>
    );
}

function StudentList({ onEdit, onDeleteRequest }) {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const loadStudents = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getStudents();
            setStudents(data);
        } catch (err) {
            if (err.message.includes("No hay token")) {
                setError("⛔ No has iniciado sesión. Debes autenticarte para ver esta lista.");
            } else {
                setError("Error al cargar la lista de estudiantes. " + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStudents();
    }, []);

    const handleDeleteClick = (student) => {
        onDeleteRequest(student); 
    };
    
    const filteredStudents = students.filter(student => {
        const fullName = `${student.first_name} ${student.last_name} ${student.last_name2 || ''}`.toLowerCase();
        const email = student.email.toLowerCase();
        const term = searchTerm.toLowerCase();
        
        return fullName.includes(term) || email.includes(term);
    });

    if (loading) return <div className="text-center p-6 text-gray-500">Cargando lista de alumnos...</div>;
    if (error) return <div className="text-center p-6 bg-red-100 text-red-700 rounded-lg">{error}</div>;

    return (
        <div className="bg-white p-6 rounded-xl shadow border">
            
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-azulF">Estudiantes registrados</h2>

                <div className="relative w-1/3 min-w-80">
                    
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>

                    <input
                        type="text"
                        placeholder="Buscar por nombre o email..."
                        className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-azulF focus:border-azulF"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="p-2 border border-gray-300">ID</th>
                        <th className="p-2 border border-gray-300">Nombre Completo</th>
                        <th className="p-2 border border-gray-300">Correo</th>
                        <th className="p-2 border border-gray-300">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStudents.length === 0 ? (
                         <tr>
                            <td colSpan="4" className="p-4 text-center text-gray-500">
                                {searchTerm 
                                    ? "No se encontraron alumnos con ese nombre/email." 
                                    : "No hay alumnos registrados."}
                            </td>
                        </tr>
                    ) : (
                        filteredStudents.map((student) => (
                            <tr key={student.id} className="hover:bg-gray-50">
                                <td className="p-2 border border-gray-300">{student.id}</td>
                                <td className="p-2 border border-gray-300">
                                    {student.first_name} {student.last_name} {student.last_name2}
                                </td>
                                <td className="p-2 border border-gray-300">{student.email}</td>
                                <td className="p-2 border border-gray-300 space-x-2">
                                    <button 
                                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
                                        onClick={() => onEdit(student)}
                                        title="Editar Alumno"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </button>
                                    <button 
                                        className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
                                        onClick={() => handleDeleteClick(student)}
                                        title="Eliminar Alumno"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

function AssignSubjects() {
    return (
        <div className="bg-white p-6 rounded-xl shadow border">
            <h2 className="text-xl font-semibold mb-6 text-azulF">Asignar materias</h2>
            <p className="text-gray-500">Funcionalidad deshabilitada temporalmente.</p>
        </div>
    );
}
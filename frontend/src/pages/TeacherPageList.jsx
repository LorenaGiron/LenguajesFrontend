import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import ProfessorForm from "../components/layout/EditUserModal.jsx"; 
import EditUserModal from "../components/layout/EditUserModal.jsx"; 
import DeleteConfirmationModal from "../components/ui/DeleteConfirmationModal.jsx"; 
import ActionStatusModal from "../components/ui/ActionStatusModal.jsx"; 
import { getProfessors, deleteProfessor, updateProfessor } from "../api/users.api.js"; 

export default function ProfessorsPage() {
    const [params, setParams] = useSearchParams();
    const view = params.get("view") || "list";
    const [professorToEdit, setProfessorToEdit] = useState(null); 
    const [professorToDelete, setProfessorToDelete] = useState(null); 
    const [reloadList, setReloadList] = useState(false);
    const [actionStatus, setActionStatus] = useState(null); 

    const handleOpenEditModal = (professor) => {
        setProfessorToEdit(professor); 
    };
    
    const handleFormClose = () => {
        setProfessorToEdit(null); 
        setReloadList(prev => !prev);
    };

    const confirmDeletion = async () => {
        if (!professorToDelete) return;

        const { id, full_name } = professorToDelete;
        const professorName = full_name;

        try {
            await deleteProfessor(id);
            setActionStatus({ status: 'success', message: `El profesor ${professorName} ha sido eliminado correctamente.` });
            
            setProfessorToDelete(null); 
            setReloadList(prev => !prev);
        } catch (err) {
            setActionStatus({ status: 'error', message: `No se pudo completar la eliminación. Causa: ${err.message}` });
            setProfessorToDelete(null); 
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-semibold text-azulF mb-4">
                {view === "list"
                    ? "Lista de Profesores"
                    : "Registrar Profesor"}
            </h1>

            <p className="text-grisF mb-8">
                {view === "list" && "Consulta, busca, edita y gestiona los profesores registrados."}
                {view === "register" && "Completa el formulario para registrar un nuevo profesor."}
            </p>

            {view === "list" && <ProfessorList 
                onEdit={handleOpenEditModal} 
                onDeleteRequest={setProfessorToDelete}
                key={reloadList} 
            />}
            
            {/* {view === "register" && <ProfessorForm onSuccess={handleFormClose} />} */}
            
            <EditUserModal 
                user={professorToEdit} 
                onClose={() => setProfessorToEdit(null)} 
                onSuccess={handleFormClose} 
                updateUserApi={updateProfessor} // Pasar la función específica de actualización
            />
            
            <DeleteConfirmationModal
                student={professorToDelete} // Se usa el mismo modal, aunque se llame student
                onClose={() => setProfessorToDelete(null)}
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

function ProfessorList({ onEdit, onDeleteRequest }) {
    const [professors, setProfessors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const loadProfessors = async () => {
        setLoading(true);
        setError(null);
        try {
            // Llama a la nueva función de API para obtener profesores
            const data = await getProfessors();
            setProfessors(data);
        } catch (err) {
            if (err.message.includes("No hay token")) {
                setError("⛔ No has iniciado sesión. Debes autenticarte para ver esta lista.");
            } else {
                setError("Error al cargar la lista de profesores. " + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfessors();
    }, []);

    const handleDeleteClick = (professor) => {
        onDeleteRequest(professor); 
    };
    
    const filteredProfessors = professors.filter(professor => {
        const fullName = professor.full_name.toLowerCase();
        const email = professor.email.toLowerCase();
        const term = searchTerm.toLowerCase();
        
        return fullName.includes(term) || email.includes(term);
    });

    if (loading) return <div className="text-center p-6 text-gray-500">Cargando lista de profesores...</div>;
    if (error) return <div className="text-center p-6 bg-red-100 text-red-700 rounded-lg">{error}</div>;

    return (
        <div className="bg-white p-6 rounded-xl shadow border">
            
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-azulF">Profesores registrados</h2>

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
                        <th className="p-2 border border-gray-300">Rol</th>
                        <th className="p-2 border border-gray-300">Activo</th>
                        <th className="p-2 border border-gray-300">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProfessors.length === 0 ? (
                         <tr>
                            <td colSpan="6" className="p-4 text-center text-gray-500">
                                {searchTerm 
                                    ? "No se encontraron profesores con ese nombre/email." 
                                    : "No hay profesores registrados."}
                            </td>
                        </tr>
                    ) : (
                        filteredProfessors.map((professor) => (
                            <tr key={professor.id} className="hover:bg-gray-50">
                                <td className="p-2 border border-gray-300">{professor.id}</td>
                                <td className="p-2 border border-gray-300">{professor.full_name}</td>
                                <td className="p-2 border border-gray-300">{professor.email}</td>
                                <td className="p-2 border border-gray-300">{professor.role}</td>
                                <td className="p-2 border border-gray-300">{professor.is_active ? 'Sí' : 'No'}</td>
                                <td className="p-2 border border-gray-300 space-x-2">
                                    <button 
                                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
                                        onClick={() => onEdit(professor)}
                                        title="Editar Profesor"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </button>
                                    <button 
                                        className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
                                        onClick={() => handleDeleteClick(professor)}
                                        title="Eliminar Profesor"
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
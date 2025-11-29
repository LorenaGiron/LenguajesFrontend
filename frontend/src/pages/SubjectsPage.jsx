import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import EditSubjectModal from "../components/subject/EditSubjectModal.jsx"; 
import DeleteConfirmationModal from "../components/ui/DeleteConfirmationModal.jsx"; 
import ActionStatusModal from "../components/ui/StatusModal.jsx"; 
import { getSubjects, deleteSubject } from "../api/subject.ap.js"; 
import SubjectForm from "../components/subject/SubjectForm.jsx";

export default function SubjectsPageList() {
    const [params] = useSearchParams();
    const view = params.get("view") || "list"; 
    
    const [subjectToEdit, setSubjectToEdit] = useState(null); 
    const [subjectToDelete, setSubjectToDelete] = useState(null);
    const [reloadList, setReloadList] = useState(false);
    const [actionStatus, setActionStatus] = useState(null); 

    const handleOpenEditModal = (subject) => {
        setSubjectToEdit(subject); 
    };
    
    const handleFormClose = () => {
        setSubjectToEdit(null); 
        setReloadList(prev => !prev);
    };

    const confirmDeletion = async () => {
        if (!subjectToDelete) return;

        const { id, name } = subjectToDelete;
        const subjectName = name;

        try {
            await deleteSubject(id);
            setActionStatus({ status: 'success', message: `La materia '${subjectName}' ha sido eliminada correctamente.` });
            
            setSubjectToDelete(null); 
            setReloadList(prev => !prev);
        } catch (err) {
            setActionStatus({ status: 'error', message: `No se pudo completar la eliminación. Causa: ${err.message}` });
            setSubjectToDelete(null); 
        }
    };
    
    if (view === "register") {
        
        return (
            <>
                <h1 className="text-3xl font-semibold text-azulF p-8">Formulario de Registro de Materias</h1>
                <SubjectForm onSuccess={() => setReloadList(prev => !prev)} />
            </>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-semibold text-azulF mb-4">
                Lista de Materias
            </h1>
            <p className="text-grisF mb-8">
                Consulta, busca, edita y gestiona las materias registradas.
            </p>

            <SubjectList 
                onEdit={handleOpenEditModal} 
                onDeleteRequest={setSubjectToDelete}
                key={reloadList} 
            />
            
            <EditSubjectModal 
                subject={subjectToEdit} 
                onClose={() => setSubjectToEdit(null)} 
                onSuccess={handleFormClose} 
            />
            
            <DeleteConfirmationModal
                student={subjectToDelete} 
                onClose={() => setSubjectToDelete(null)}
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

function SubjectList({ onEdit, onDeleteRequest }) {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const loadSubjects = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getSubjects();
            setSubjects(data);
        } catch (err) {
            if (err.message.includes("No hay token")) {
                setError("⛔ No has iniciado sesión. Debes autenticarte para ver esta lista.");
            } else {
                setError("Error al cargar la lista de materias. " + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSubjects();
    }, []);

    const handleDeleteClick = (subject) => {
        onDeleteRequest(subject); 
    };
    
    const filteredSubjects = subjects.filter(subject => {
        const name = subject.name.toLowerCase();
        const term = searchTerm.toLowerCase();
        
       
        const teacherName = subject.teacher?.full_name?.toLowerCase() || ''; 
        
        return name.includes(term) || teacherName.includes(term);
    });

    if (loading) return <div className="text-center p-6 text-gray-500">Cargando lista de materias...</div>;
    if (error) return <div className="text-center p-6 bg-red-100 text-red-700 rounded-lg">{error}</div>;

    return (
        <div className="bg-white p-6 rounded-xl shadow border">
            
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-azulF">Materias registradas</h2>

                <div className="relative w-1/3 min-w-80">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>

                    <input
                        type="text"
                        placeholder="Buscar por nombre o profesor..."
                        className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-azulF focus:border-azulF"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="p-2 border border-grisM">ID</th>
                        <th className="p-2 border border-grisM">Materia</th>
                        <th className="p-2 border border-grisM">Profesor Asignado</th>
                        <th className="p-2 border border-grisM">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSubjects.length === 0 ? (
                             <tr>
                                 <td colSpan="4" className="p-4 text-center text-gray-500">
                                     {searchTerm 
                                         ? "No se encontraron materias con ese filtro." 
                                         : "No hay materias registradas."}
                                 </td>
                             </tr>
                    ) : (
                        filteredSubjects.map((subject) => (
                            <tr key={subject.id} className="hover:bg-gray-50">
                                <td className="p-2 border border-grisM">{subject.id}</td>
                                <td className="p-2 border border-grisM">{subject.name}</td>
                                <td className="p-2 border border-grisM">
                                  
                                    {subject.teacher?.full_name || 'N/A'}
                                </td>
                                <td className="p-2 border border-grisM space-x-2">
                                    <button 
                                        className="bg-azulF text-white p-2 rounded hover:bg-azulM transition-colors"
                                        onClick={() => onEdit(subject)}
                                        title="Editar Materia"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </button>
                                    <button 
                                        className="bg-rojoF text-white p-2 rounded hover:bg-rojoC transition-colors"
                                        onClick={() => handleDeleteClick(subject)}
                                        title="Eliminar Materia"
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
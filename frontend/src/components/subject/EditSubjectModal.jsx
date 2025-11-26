import React, { useState, useEffect } from "react";
// Asegúrate de que las rutas a tus APIs y modales sean correctas
import { updateSubject } from "../../api/subject.ap.js"; 
import { getProfessors } from "../../api/users.api.js"; 

const EditSubjectModal = ({ subject, onClose, onSuccess }) => {
    // Solo renderiza si hay una materia para editar
    if (!subject) return null;

    const [formData, setFormData] = useState({
        name: subject.name || "",
        // teacher_id se maneja como string en el select. Usamos el valor actual.
        teacher_id: String(subject.teacher_id) || "", 
    });
    const [professors, setProfessors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Cargar la lista de profesores al inicio del modal ---
    useEffect(() => {
        const loadProfessors = async () => {
            try {
                // Llama a la función que trae la lista de profesores (filtrada por rol 'profesor')
                const data = await getProfessors(); 
                setProfessors(data); 
            } catch (err) {
                setError(`Error al cargar profesores: ${err.message}`);
                setProfessors([]);
            } finally {
                setListLoading(false);
            }
        };
        loadProfessors();
        
        // Resetear el formulario al cambiar de materia (o al abrir)
        setFormData({
            name: subject.name || "",
            teacher_id: String(subject.teacher_id) || "",
        });
    }, [subject.id]); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!formData.name || !formData.teacher_id) {
            setError('Por favor, completa el nombre de la materia y asigna un profesor.');
            setLoading(false);
            return;
        }

        // Prepara los datos para la petición PUT
        const dataToSend = {
            name: formData.name,
            teacher_id: parseInt(formData.teacher_id), 
        };

        try {
            await updateSubject(subject.id, dataToSend);
            onSuccess(); // Cierra el modal y refresca la lista
        } catch (err) {
            setError(err.message || "Error desconocido al actualizar.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all"
                onClick={(e) => e.stopPropagation()} 
            >
                {/* Header (Azul oscuro: azulF) */}
                <div className="px-6 py-4 bg-azulF text-white flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Editar Materia: {subject.name}</h2>
                    <button onClick={onClose} className="text-xl hover:text-grisC transition-colors">
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    
                    {/* Mensajes de error del formulario */}
                    {error && (
                        <div className="bg-red-100 text-danger p-3 rounded-lg border border-danger">
                            {error}
                        </div>
                    )}

                    {/* 1. Nombre de la Materia */}
                    <div className="space-y-1">
                        <label htmlFor="name" className="block text-sm font-semibold text-grisF">Nombre de la Materia *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-3 border-2 border-grisM/50 rounded-lg focus:ring-2 focus:ring-azulM focus:border-azulM transition-shadow"
                            required
                        />
                    </div>

                    {/* 2. Asignar Profesor */}
                    <div className="space-y-1">
                        <label htmlFor="teacher_id" className="block text-sm font-semibold text-grisF">Profesor Asignado *</label>
                        <div className="relative">
                            {listLoading && <p className="text-sm text-grisM">Cargando profesores...</p>}
                            {!listLoading && (
                                <select
                                    id="teacher_id"
                                    name="teacher_id"
                                    value={formData.teacher_id}
                                    onChange={handleChange}
                                    className="w-full p-3 border-2 border-grisM/50 rounded-lg focus:ring-2 focus:ring-azulM focus:border-azulM transition-shadow bg-white"
                                    required
                                    disabled={professors.length === 0}
                                >
                                    <option value="">-- Selecciona un Profesor --</option>
                                    {professors.map((prof) => (
                                        // Usamos el ID del profesor como valor
                                        <option key={prof.id} value={prof.id}> 
                                            {prof.full_name} ({prof.email})
                                        </option>
                                    ))}
                                </select>
                            )}
                            {professors.length === 0 && !listLoading && (
                                <p className="text-sm text-danger mt-1">No hay profesores disponibles para reasignar.</p>
                            )}
                        </div>
                    </div>

                    {/* Botón de envío */}
                    <div className="flex justify-end pt-4 space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-grisF border border-grisM rounded-md hover:bg-grisC transition-colors"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-azulM text-white rounded-md hover:bg-azulF transition-colors disabled:bg-grisM"
                            disabled={loading || listLoading || professors.length === 0}
                        >
                            {loading ? "Guardando..." : "Guardar Cambios"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditSubjectModal;
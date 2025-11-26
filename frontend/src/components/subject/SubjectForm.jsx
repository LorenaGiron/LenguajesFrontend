import React, { useState, useEffect } from "react";
// Asegúrate de que estas rutas sean correctas
import { createSubject } from "../../api/subject.ap.js"; 
import { getProfessors } from "../../api/users.api.js"; 
import FormStatusModal from "../ui/StatusModal.jsx"; 

const SubjectForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        name: "",
        teacher_id: "",
    });
    const [professors, setProfessors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(true);
    const [statusModal, setStatusModal] = useState(null); 

    // --- Cargar la lista de profesores al inicio ---
    useEffect(() => {
        const loadProfessors = async () => {
            try {
                // Asume que getProfessors trae la lista de usuarios con rol 'profesor'
                const data = await getProfessors(); 
                setProfessors(data); 
            } catch (err) {
                setStatusModal({ status: 'error', message: `Error al cargar la lista de profesores: ${err.message}` });
                setProfessors([]);
            } finally {
                setListLoading(false);
            }
        };
        loadProfessors();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatusModal(null);

        if (!formData.name || !formData.teacher_id) {
            setStatusModal({ status: 'error', message: 'Por favor, completa el nombre de la materia y asigna un profesor.' });
            setLoading(false);
            return;
        }

        const dataToSend = {
            name: formData.name,
            // Convertimos el ID del profesor a entero (int), que es lo que espera FastAPI.
            teacher_id: parseInt(formData.teacher_id), 
        };

        try {
            await createSubject(dataToSend);
            setStatusModal({ status: 'success', message: `🎉 Materia '${formData.name}' registrada con éxito.` });
            
            setFormData({ name: "", teacher_id: "" });
            
            setTimeout(onSuccess, 1500); 

        } catch (err) {
            setStatusModal({ status: 'error', message: `Error al registrar materia: ${err.message}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg border border-grisC">
            
            <h3 className="text-2xl font-bold text-azulF mb-6 border-b border-grisC pb-2">Registrar Nueva Materia</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Nombre de la Materia */}
                <div className="space-y-1">
                    <label htmlFor="name" className="text-sm font-semibold text-grisF">Nombre de la Materia *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 border-2 border-grisM/50 rounded-lg focus:ring-2 focus:ring-azulM focus:border-azulM transition-shadow"
                        placeholder="Ej: Cálculo Diferencial" 
                        required
                    />
                </div>

                {/* Asignar Profesor */}
                <div className="space-y-1">
                    <label htmlFor="teacher_id" className="text-sm font-semibold text-grisF">Profesor Asignado *</label>
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
                                    <option key={prof.id} value={prof.id}>
                                        {prof.full_name} ({prof.email})
                                    </option>
                                ))}
                            </select>
                        )}
                        {professors.length === 0 && !listLoading && (
                            <p className="text-sm text-danger mt-1">No hay profesores disponibles para asignar.</p>
                        )}
                    </div>
                </div>

                {/* Botón de Registro */}
                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full h-14 bg-azulF text-white font-bold rounded-lg hover:bg-azulM transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
                        disabled={loading || listLoading || professors.length === 0}
                        title="Registrar Nueva Materia"
                    >
                        {loading ? (
                            <span className="text-lg">Procesando...</span>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                        )}
                    </button>
                </div>
            </form>

            <FormStatusModal
                status={statusModal ? statusModal.status : null}
                message={statusModal ? statusModal.message : ''}
                onClose={() => setStatusModal(null)}
            />
        </div>
    );
};

export default SubjectForm;
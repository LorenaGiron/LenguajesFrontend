import React, { useState } from "react";
import { createProfessor } from "../../api/users.api.js"; 
import FormStatusModal from "../ui/StatusModal.jsx";

const ProfessorForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        role: "profesor", 
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [statusModal, setStatusModal] = useState(null); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatusModal(null);

        if (!formData.full_name || !formData.email || !formData.password) {
            setStatusModal({ status: 'error', message: 'Por favor, completa los campos obligatorios (*).' });
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setStatusModal({ status: 'error', message: 'Las contraseñas no coinciden.' });
            setLoading(false);
            return;
        }

        const dataToSend = {
            full_name: formData.full_name,
            email: formData.email,
            role: formData.role,
            password: formData.password,
            // is_active se omite y usa el default (true) del backend.
        };

        try {
            await createProfessor(dataToSend);
            setStatusModal({ status: 'success', message: '🎉 Profesor registrado con éxito.' });
            
            setFormData({ full_name: "", email: "", role: "profesor", password: "", confirmPassword: "" });
            
            // Redirigir/Recargar la lista
            setTimeout(onSuccess, 1500); 

        } catch (err) {
            setStatusModal({ status: 'error', message: `Error al registrar: ${err.message}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg border border-grisC">
            
            <h3 className="text-2xl font-bold text-azulF mb-6 border-b border-grisC pb-2">Datos de Registro del Profesor</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Nombre Completo y Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nombre(s) Completo */}
                    <div className="space-y-1">
                        <label htmlFor="full_name" className="text-sm font-semibold text-grisF">Nombre Completo *</label>
                        <input
                            type="text"
                            id="full_name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className="w-full p-3 border-2 border-grisM/50 rounded-lg focus:ring-2 focus:ring-azulM focus:border-azulM transition-shadow"
                            placeholder="Ej: Dra. Alicia Hernández" 
                            required
                        />
                    </div>
                    {/* Email */}
                    <div className="space-y-1">
                        <label htmlFor="email" className="text-sm font-semibold text-grisF">Correo Electrónico *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 border-2 border-grisM/50 rounded-lg focus:ring-2 focus:ring-azulM focus:border-azulM transition-shadow"
                            placeholder="alicia.hdez@universidad.edu" 
                            required
                        />
                    </div>
                </div>

                {/* Contraseña y Confirmación */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contraseña */}
                    <div className="space-y-1">
                        <label htmlFor="password" className="text-sm font-semibold text-grisF">Contraseña *</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-3 border-2 border-grisM/50 rounded-lg focus:ring-2 focus:ring-azulM focus:border-azulM transition-shadow"
                            placeholder="Debe tener al menos 8 caracteres" 
                            required
                        />
                    </div>
                    {/* Confirmar Contraseña */}
                    <div className="space-y-1">
                        <label htmlFor="confirmPassword" className="text-sm font-semibold text-grisF">Confirmar Contraseña *</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full p-3 border-2 border-grisM/50 rounded-lg focus:ring-2 focus:ring-azulM focus:border-azulM transition-shadow"
                            placeholder="Repita la contraseña" 
                            required
                        />
                    </div>
                </div>
                
                {/* Rol (Para el Admin que asigna roles) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label htmlFor="role" className="text-sm font-semibold text-grisF">Rol del Usuario</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full p-3 border-2 border-grisM/50 rounded-lg focus:ring-2 focus:ring-azulM focus:border-azulM transition-shadow bg-white"
                        >
                            <option value="profesor">Profesor</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>
                </div>


                {/* Botón de Registro - SOLO ICONO */}
                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full h-14 bg-azulF text-white font-bold rounded-lg hover:bg-azulM transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
                        disabled={loading}
                        title="Registrar Nuevo Profesor"
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

export default ProfessorForm;
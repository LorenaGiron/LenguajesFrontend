import React, { useState } from "react";
import { createStudent } from "../api/students.api.js"; 
import FormStatusModal from "../components/ui/StatusModal.jsx";
import Button from "../components/ui/Button.jsx";
import ButtonR from "../components/ui/ButtonRed.jsx";
import Input from "../components/ui/Input.jsx";

const StudentForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        last_name2: "",
        email: "",
        enrollment_code: "",
        notes: "",
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

        if (!formData.first_name || !formData.last_name || !formData.email) {
            setStatusModal({ status: 'error', message: 'Por favor, completa los campos obligatorios (*).' });
            setLoading(false);
            return;
        }

        const dataToSend = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            last_name2: formData.last_name2 || null, 
            email: formData.email,
        };

        try {
            await createStudent(dataToSend);
            setStatusModal({ status: 'success', message: 'Alumno registrado y guardado en la base de datos.' });
            
            setFormData({ first_name: "", last_name: "", last_name2: "", email: "", enrollment_code: "", notes: "" });
            

        } catch (err) {
            setStatusModal({ status: 'error', message: `Error al registrar: ${err.message}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg border border-grisC">
            
            <h3 className="text-2xl font-bold text-azulF mb-6 border-b border-grisC pb-2">Datos de Registro</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. Nombre y Apellidos */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Nombre(s) */}
                    <div className="space-y-1">
                        <label htmlFor="first_name" className="text-sm font-semibold text-grisF">Nombre(s) *</label>
                        <Input
                            type="text"
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            placeholder="Juan" 
                            required
                        />
                    </div>
                    {/* Apellido Paterno */}
                    <div className="space-y-1">
                        <label htmlFor="last_name" className="text-sm font-semibold text-grisF">Apellido Paterno *</label>
                        <Input
                            type="text"
                            id="last_name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            placeholder="Pérez" 
                            required
                        />
                    </div>
                    {/* Apellido Materno */}
                    <div className="space-y-1">
                        <label htmlFor="last_name2" className="text-sm font-semibold text-grisF">Apellido Materno</label>
                        <Input
                            type="text"
                            id="last_name2"
                            name="last_name2"
                            value={formData.last_name2}
                            onChange={handleChange}
                            placeholder="García (Opcional)" 
                        />
                    </div>
                </div>

                {/* 2. Email y Matrícula */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email */}
                    <div className="space-y-1">
                        <label htmlFor="email" className="text-sm font-semibold text-grisF">Correo Electrónico *</label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="juan.perez@prisma.com" 
                            required
                        />
                    </div>
                    {/* Matrícula */}
                    <div className="space-y-1">
                        <label htmlFor="enrollment_code" className="text-sm font-semibold text-grisF">Matrícula</label>
                        <Input
                            type="text"
                            id="enrollment_code"
                            name="enrollment_code"
                            value={formData.enrollment_code}
                            onChange={handleChange}
                            placeholder="Ej: A2025001 (Opcional)" 
                        />
                    </div>
                </div>

                {/* Botón de Registro  */}
                <div className="pt-4">
                    <button
                        type="submit"
                        // 
                        className="w-full h-14 bg-azulF text-white font-bold rounded-lg hover:bg-gray transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
                        disabled={loading}
                        title="Registrar Nuevo Alumno"
                    >
                        {loading ? (
                            <span className="text-lg">Procesando...</span>
                        ) : (
                            // Icono de Plus/Registro (H-7 W-7)
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

export default StudentForm;
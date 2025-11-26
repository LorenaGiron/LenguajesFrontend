import React, { useState, useEffect } from "react";

import { updateProfessor } from "../../api/users.api"; 

const EditProfessorModal = ({ user, onClose, onSuccess }) => {
   
    if (!user) return null;

   
    const [formData, setFormData] = useState({
        full_name: user.full_name || "",
        email: user.email || "",
        role: user.role || "profesor", 
        is_active: user.is_active || false,
        password: "", 
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

   
    useEffect(() => {
        setFormData({
            full_name: user.full_name || "",
            email: user.email || "",
            role: user.role || "profesor",
            is_active: user.is_active,
            password: "",
        });
    }, [user]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
      
        const dataToSend = {};
        for (const [key, value] of Object.entries(formData)) {
            if (value !== user[key] && value !== "" && value !== null) {
                dataToSend[key] = value;
            } else if (key === 'is_active' && value !== user.is_active) {
                 dataToSend[key] = value;
            }
        }
        
        if (dataToSend.password === "") {
            delete dataToSend.password;
        }

        try {
            await updateProfessor(user.id, dataToSend);
            setLoading(false);
            onSuccess(); 
        } catch (err) {
            setError(err.message || "Error desconocido al actualizar.");
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all"
                onClick={(e) => e.stopPropagation()} 
            >
                <div className="px-6 py-4 bg-azulF text-white flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Editar Profesor: {user.full_name}</h2>
                    <button onClick={onClose} className="text-xl hover:text-grisC transition-colors">
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    
                    {error && (
                        <div className="bg-danger/10 text-danger p-3 rounded-lg border border-danger">
                            {error}
                        </div>
                    )}

                    {/* Nombre y Email */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="full_name" className="block text-sm font-medium text-grisF">Nombre Completo</label>
                            <input
                                type="text"
                                id="full_name"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                className="w-full p-2 border border-grisM rounded-md focus:ring-azulM focus:border-azulM"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-grisF">Correo Electrónico</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-2 border border-grisM rounded-md focus:ring-azulM focus:border-azulM"
                                required
                            />
                        </div>
                    </div>
                    
                    {/* Contraseña y Rol */}
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="password" className="block text-sm font-medium text-grisF">Contraseña (Dejar vacío para no cambiar)</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-2 border border-grisM rounded-md focus:ring-azulM focus:border-azulM"
                                placeholder="******"
                            />
                        </div>
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-grisF">Rol</label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full p-2 border border-grisM rounded-md focus:ring-azulM focus:border-azulM"
                            >
                                <option value="profesor">Profesor</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* Estado Activo */}
                    <div className="flex items-center pt-2">
                        <input
                            type="checkbox"
                            id="is_active"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleChange}
                            className="h-4 w-4 text-azulM border-gray-300 rounded focus:ring-azulM"
                        />
                        <label htmlFor="is_active" className="ml-2 block text-sm font-medium text-grisF">
                            Usuario Activo
                        </label>
                    </div>
                    
                    {/* Footer / Actions */}
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
                            disabled={loading}
                        >
                            {loading ? "Guardando..." : "Guardar Cambios"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfessorModal;
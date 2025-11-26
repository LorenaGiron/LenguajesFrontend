import React, { useState, useEffect } from "react";
import { updateStudent } from "../../api/students.api"; 

const EditStudentModal = ({ student, onClose, onSuccess }) => {
    // No renderiza si no hay un estudiante para editar
    if (!student) return null;

    // Inicializa el estado del formulario con los datos del estudiante
    const [formData, setFormData] = useState({
        first_name: student.first_name || "",
        last_name: student.last_name || "",
        last_name2: student.last_name2 || "",
        email: student.email || "",
        enrollment_code: student.enrollment_code || "", 
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Si la prop 'student' cambia (aunque no debería en un modal abierto)
    useEffect(() => {
        setFormData({
            first_name: student.first_name || "",
            last_name: student.last_name || "",
            last_name2: student.last_name2 || "",
            email: student.email || "",
            enrollment_code: student.enrollment_code || "",
        });
    }, [student]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Filtramos datos vacíos, asumiendo que FastAPI maneja el PUT parcial (StudentUpdate)
        const dataToSend = Object.fromEntries(
            Object.entries(formData).filter(([_, v]) => v !== null && v !== "")
        );

        try {
            await updateStudent(student.id, dataToSend);
            setLoading(false);
            onSuccess(); // Cierra el modal y refresca la lista
        } catch (err) {
            setError(err.message || "Error desconocido al actualizar.");
            setLoading(false);
        }
    };

    return (
        // Overlay (Fondo oscuro)
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            
            {/* Contenido del Modal */}
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all"
                onClick={(e) => e.stopPropagation()} 
            >
                {/* Header (Azul oscuro: azulF) */}
                <div className="px-6 py-4 bg-azulF text-white flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Editar Alumno: {student.first_name} {student.last_name}</h2>
                    <button onClick={onClose} className="text-xl hover:text-grisC transition-colors">
                        &times;
                    </button>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    
                    {error && (
                        <div className="bg-danger/10 text-danger p-3 rounded-lg border border-danger">
                            {error}
                        </div>
                    )}

                    {/* Fila de Nombre y Apellido */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="first_name" className="block text-sm font-medium text-grisF">Nombre</label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="w-full p-2 border border-grisM rounded-md focus:ring-azulM focus:border-azulM"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="last_name" className="block text-sm font-medium text-grisF">Apellido Paterno</label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="w-full p-2 border border-grisM rounded-md focus:ring-azulM focus:border-azulM"
                                required
                            />
                        </div>
                    </div>
                    
                    {/* Fila de Apellido Materno y Email */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="last_name2" className="block text-sm font-medium text-grisF">Apellido Materno (Opcional)</label>
                            <input
                                type="text"
                                id="last_name2"
                                name="last_name2"
                                value={formData.last_name2}
                                onChange={handleChange}
                                className="w-full p-2 border border-grisM rounded-md focus:ring-azulM focus:border-azulM"
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

                    {/* Fila de Código de Matrícula (Enrollment Code) */}
                    <div>
                        <label htmlFor="enrollment_code" className="block text-sm font-medium text-grisF">Código de Matrícula (Opcional)</label>
                        <input
                            type="text"
                            id="enrollment_code"
                            name="enrollment_code"
                            value={formData.enrollment_code}
                            onChange={handleChange}
                            className="w-full p-2 border border-grisM rounded-md focus:ring-azulM focus:border-azulM"
                        />
                    </div>
                    
                    {/* Footer / Botones (Azul medio: azulM) */}
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

export default EditStudentModal;
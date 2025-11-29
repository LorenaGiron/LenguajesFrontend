import React, { useState, useEffect } from 'react';

export default function AssignmentModal({ subject, currentStudents, allStudents, onClose, onSuccess, assignApi, onStatus }) {

    const [selectedStudentIds, setSelectedStudentIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Solo estudiantes NO asignados actualmente
    const availableStudents = allStudents.filter(
        s => !currentStudents.some(cs => cs.id === s.id)
    );

    // Vacía la selección inicial
    useEffect(() => {
        setSelectedStudentIds([]);
    }, [currentStudents]);

    const handleCheckboxChange = (studentId) => {
        setSelectedStudentIds(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Construir lista final: estudiantes ya asignados + nuevos seleccionados
            const finalStudentList = [
                ...currentStudents.map(s => s.id),
                ...selectedStudentIds
            ];

            const updatedSubject = await assignApi(subject.id, finalStudentList);

            onSuccess(updatedSubject);

            onStatus({ 
                status: 'success', 
                message: `Estudiantes asignados a "${subject.name}" con éxito.` 
            });

            onClose();
        } catch (err) {
            const msg = "Error al asignar estudiantes: " + (err.response?.data?.detail || err.message);

            onStatus({
                status: "error",
                message: msg
            });

            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-xl w-full">
                <h2 className="text-2xl font-semibold mb-4 text-azulF border-b pb-2">
                    Asignar Estudiantes a {subject.name}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="max-h-80 overflow-y-auto border p-3 rounded mb-4">

                        {error && <p className="text-red-500 mb-3">{error}</p>}

                        {availableStudents.length === 0 && (
                            <p className="text-gray-500">Todos los estudiantes ya están asignados.</p>
                        )}

                        {availableStudents.map(student => (
                            <div key={student.id} className="flex items-center space-x-3 py-1 border-b last:border-b-0">
                                <input
                                    type="checkbox"
                                    id={`student-${student.id}`}
                                    checked={selectedStudentIds.includes(student.id)}
                                    onChange={() => handleCheckboxChange(student.id)}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                />
                                <label htmlFor={`student-${student.id}`} className="flex-1 cursor-pointer">
                                    <span className="font-medium">
                                        {student.first_name} {student.last_name}
                                    </span>
                                    <span className="text-sm text-gray-500 block">
                                        Email: {student.email}
                                    </span>
                                </label>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-grisC"
                            disabled={loading}
                        >
                            Cancelar
                        </button>

                        {availableStudents.length > 0 && (
                            <button
                                type="submit"
                                className="px-4 py-2 bg-azulF text-white rounded-lg hover:bg-azulM disabled:bg-grisC"
                                disabled={loading}
                            >
                                {loading ? 'Guardando...' : 'Guardar Asignaciones'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

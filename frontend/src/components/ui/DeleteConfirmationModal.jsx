import React from 'react';
import ButtonR from './ButtonRed.jsx';

const DeleteConfirmationModal = ({ student, onClose, onConfirm }) => {
    if (!student) return null;

    const studentName = `${student.first_name} ${student.last_name}`;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all"
                onClick={(e) => e.stopPropagation()} 
            >
                <div className="px-6 py-4 bg-azulF text-white flex items-center">
                    <h2 className="text-xl font-semibold">Confirmar Eliminación</h2>
                </div>

                <div className="p-6">
                    <div className="flex items-start space-x-4 p-4 bg-red-50 border-l-4 border-danger rounded-md">
                        <svg className="h-6 w-6 text-danger mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.398 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                            <p className="text-lg font-semibold text-danger">Eliminación Permanente</p>
                            <p className="text-sm text-grisF mt-1">
                                ¿Estás seguro de que deseas eliminar
                                <span className="font-bold text-azulF"></span>?
                            </p>
                            <p className="text-sm text-grisF mt-1">Esta acción no se puede deshacer.</p>
                        </div>
                    </div>
                </div>
                
                <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 border-t">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-grisF border border-grisM rounded-md hover:bg-grisC transition-colors"
                    >
                        Cancelar
                    </button>
                    <ButtonR
                        type="button"
                        onClick={onConfirm}
                        >
                        Sí, Eliminar
                    </ButtonR>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
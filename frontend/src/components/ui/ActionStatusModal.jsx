import React from 'react';

const ActionStatusModal = ({ status, message, onClose }) => {
    if (!status) return null;

    const isSuccess = status === 'success';
    const bgColor = isSuccess ? 'bg-green-100' : 'bg-red-100';
    const borderColor = isSuccess ? 'border-green-600' : 'border-danger';
    const textColor = isSuccess ? 'text-green-800' : 'text-danger';
    const iconColor = isSuccess ? 'text-green-600' : 'text-danger';
    const title = isSuccess ? 'Operación Exitosa' : 'Error en la Acción';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-sm transform transition-all"
                onClick={(e) => e.stopPropagation()} 
            >
                <div className={`p-5 rounded-t-xl flex items-center ${bgColor} border-b-2 ${borderColor}`}>
                    <svg className={`h-6 w-6 mr-3 ${iconColor}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {isSuccess ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        )}
                    </svg>
                    <h3 className={`text-lg font-semibold ${textColor}`}>{title}</h3>
                </div>

                <div className="p-5">
                    <p className="text-grisF">{message}</p>
                </div>
                
                <div className="px-5 py-3 bg-gray-50 flex justify-end border-t">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-azulM text-white rounded-md hover:bg-azulF transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActionStatusModal;
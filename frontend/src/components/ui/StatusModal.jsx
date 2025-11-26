import React from 'react';

const FormStatusModal = ({ status, message, onClose }) => {
    if (!status) return null;

    const isSuccess = status === 'success';
    const bgColor = isSuccess ? 'bg-azulC' : 'bg-red-50';
    const borderColor = isSuccess ? 'border-azulM' : 'border-danger';
    const textColor = isSuccess ? 'text-azulF' : 'text-danger';
    const icon = isSuccess ? (
        <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ) : (
        <svg className="h-6 w-6 text-danger" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    );
    const title = isSuccess ? '¡Registro Exitoso!' : 'Error de Registro';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all"
                onClick={(e) => e.stopPropagation()} 
            >
                <div className={`px-6 py-4 flex items-center border-b ${borderColor}`}>
                    <div className="mr-3">{icon}</div>
                    <h2 className={`text-xl font-bold ${textColor}`}>{title}</h2>
                </div>

                <div className="p-6">
                    <div className={`p-3 rounded-md ${bgColor} border ${borderColor} text-sm ${textColor}`}>
                        {message}
                    </div>
                    {isSuccess && <p className="text-sm text-grisF mt-3">Serás redirigido a la lista en un momento.</p>}
                </div>
                
                <div className="px-6 py-4 bg-gray-50 flex justify-end border-t">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-azulM text-white rounded-lg font-semibold hover:bg-azulF transition-colors"
                    >
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FormStatusModal;
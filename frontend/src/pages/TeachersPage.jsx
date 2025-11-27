// TeachersPage.jsx

import { useState } from "react";
import ProfessorForm from "../components/professors/ProfessorForm";

export default function TeachersPage() {
    const [view, setView] = useState("list");

    const handleFormClose = () => {
        setView("list");
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-semibold text-azulF mb-6">Gestión de Profesores</h1>
            
            <div className="mb-6">
                <button 
                    onClick={() => setView("register")}
                    className="px-4 py-2 bg-azulM text-white rounded-lg hover:bg-azulF transition"
                >
                    Agregar Profesor
                </button>
            </div>
            
            {view === "register" && <ProfessorForm onSuccess={handleFormClose} />} 
        </div>
    );
}
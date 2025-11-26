// ProfessorsPage.jsx

import ProfessorForm from "../components/professors/ProfessorForm.jsx"; // Asegúrate de la ruta

export default function ProfessorsPage() {
    // ... lógica y estados ...

    return (
        <div className="p-8">
          

           
            {view === "list" && <ProfessorList ... />}
            {view === "register" && <ProfessorForm onSuccess={handleFormClose} />} 
            
          
        </div>
    );
}
import { useSearchParams } from "react-router-dom";
import IndividualReport from "../components/students/IndividualReport";
import CalificacionesPorMateria from "../components/subject/SubjectGrades";

export default function ReportsPage() {
  const [params] = useSearchParams();
  const view = params.get("view") || "boleta";

  return (
    <div className="p-8">

      {/* Título dinámico */}
      <h1 className="text-3xl font-semibold text-azulF mb-4">
        {view === "boleta" && "Boleta individual"}
        {view === "calif" && "Calificaciones por materia"}
      </h1>

      {/* Descripción dinámica */}
      <p className="text-grisF mb-6">
        {view === "boleta" && "Consulta las calificaciones completas de un alumno."}
        {view === "calif" && "Selecciona una materia para ver sus calificaciones."}
      </p>

      {/* Contenido dinámico */}
      {view === "boleta" && <IndividualReport />}
      {view === "calif" && <CalificacionesPorMateria />}
    </div>
  );
}

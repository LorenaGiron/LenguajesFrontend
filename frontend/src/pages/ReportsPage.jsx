import { useSearchParams } from "react-router-dom";
import IndividualReport from "../components/students/IndividualReport";

export default function ReportsPage() {
  const [params] = useSearchParams();
  const view = params.get("view") || "individual";

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-azulF mb-4">
        {view === "individual" ? "Boleta individual" : "Reportes"}
      </h1>

      <p className="text-grisF mb-8">
        {view === "individual" && "Consulta la boleta de un alumno por matrícula."}
      </p>

      {/* Contenido dinámico */}
      {view === "individual" && <IndividualReport />}
    </div>
  );
}

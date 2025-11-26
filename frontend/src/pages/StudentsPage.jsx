import { useSearchParams } from "react-router-dom";
import StudentForm from "../components/students/StudentForm";

export default function StudentsPage() {
  const [params] = useSearchParams();
  const view = params.get("view") || "list"; 

  return (
    <div className="p-8">
      {/* Título dinámico */}
      <h1 className="text-3xl font-semibold text-azulF mb-4">
        {view === "list"
          ? "Lista de alumnos"
          : view === "register"
          ? "Registrar alumno"
          : "Asignar materias"}
      </h1>

      {/* Subtítulo */}
      <p className="text-grisF mb-8">
        {view === "list" && "Consulta, busca y gestiona los alumnos registrados."}
        {view === "register" && "Completa el formulario para registrar un nuevo alumno."}
        {view === "assign" && "Asigna materias a un alumno existente."}
      </p>

      {/* Contenido dinámico */}
      {view === "list" && <StudentList />}
      {view === "register" && <StudentForm />}
      {view === "assign" && <AssignSubjects />}
    </div>
  );
}

function StudentList() {
  return (
    <div className="bg-white p-6 rounded-xl shadow border">
      <h2 className="text-xl font-semibold mb-4 text-azulF">Estudiantes registrados</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Correo</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
      </table>
    </div>
  );
}

function AssignSubjects() {
  return (
    <div className="bg-white p-6 rounded-xl shadow border">
      <h2 className="text-xl font-semibold mb-6 text-azulF">Asignar materias</h2>
    </div>
  );
}

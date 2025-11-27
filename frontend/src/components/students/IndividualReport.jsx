import { useState } from "react";

export default function IndividualReport() {
  const [matricula, setMatricula] = useState("");
  const [boleta, setBoleta] = useState(null);

  const buscarBoleta = async (e) => {
    e.preventDefault();

    // Aquí harás la petición a tu API más adelante
    // Por ahora simulamos datos:
    const datos = {
      nombre: "Juan Pérez",
      matricula: matricula,
      materias: [
        { nombre: "Matemáticas", calificacion: 95 },
        { nombre: "Historia", calificacion: 88 },
        { nombre: "Biología", calificacion: 90 }
      ]
    };

    setBoleta(datos);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow border">
      <h2 className="text-xl font-semibold text-azulF mb-6">
        Consultar boleta
      </h2>

      <form onSubmit={buscarBoleta} className="flex gap-4 mb-6">
        <input
          type="text"
          value={matricula}
          onChange={(e) => setMatricula(e.target.value)}
          placeholder="Matrícula del alumno"
          className="border p-3 rounded flex-1"
        />
        <button className="bg-azulF text-white px-6 rounded hover:bg-azulM transition">
          Buscar
        </button>
      </form>

      {boleta && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-azulF mb-3">
            Boleta de {boleta.nombre}
          </h3>

          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Materia</th>
                <th className="p-2 border">Calificación</th>
              </tr>
            </thead>
            <tbody>
              {boleta.materias.map((m, i) => (
                <tr key={i}>
                  <td className="p-2 border">{m.nombre}</td>
                  <td className="p-2 border">{m.calificacion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

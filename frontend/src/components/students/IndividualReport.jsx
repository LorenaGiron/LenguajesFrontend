import React, { useState, useEffect } from "react";
import { Search, Download, GraduationCap } from "lucide-react";
import { getStudentGradesReport, searchStudents } from "../../api/students.api.js";

export default function StudentGradesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // BUSQUEDA CON DEBOUNCE
    useEffect(() => {
        setError(null);
        setSuggestions([]);

        if (searchTerm.length < 3) return;

        const timer = setTimeout(async () => {
            try {
                setLoading(true);
                const results = await searchStudents(searchTerm);
                setSuggestions(results || []);
            } catch {
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const fetchReport = async (identifier) => {
        setLoading(true);
        setError(null);
        setReport(null);
        setSuggestions([]);

        try {
            const data = await getStudentGradesReport(identifier);
            setReport(data);
            setSearchTerm(data.student_name);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => setSearchTerm(e.target.value);

    // CORREGIDO ✔
    const handleSuggestionClick = (student) => {
        // hacemos la búsqueda por email (único y seguro)
        fetchReport(student.email);

        // rellenamos el input
        setSearchTerm(`${student.first_name} ${student.last_name}`);
        setSuggestions([]);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;
        fetchReport(searchTerm.trim());
    };

    const handleExportCSV = () => {
        if (!report || report.grades.length === 0) return alert("No hay datos para exportar.");

        const studentName = report.student_name;
        const headers = ["Nombre_Alumno", "ID_Alumno", "Materia", "Calificacion", "Promedio_Total"];
        let csvContent = headers.join(";") + "\n";

        csvContent += [
            `"${studentName}"`,
            report.student_id,
            "PROMEDIO GENERAL",
            "",
            report.total_average.toString().replace('.', ',')
        ].join(";") + "\n";

        report.grades.forEach(grade => {
            csvContent += [
                `"${studentName}"`,
                report.student_id,
                `"${grade.subject_name.replace(/"/g, '""')}"`,
                grade.score.toString().replace('.', ','),
                ""
            ].join(";") + "\n";
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = `Reporte_Notas_${studentName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.csv`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-8">
            <div className="bg-white p-6 rounded-xl shadow border mb-8">
                <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 items-end relative">
                    <div className="flex-1 w-full relative">
                        <label className="block text-sm font-medium text-grisF mb-2">
                            Buscar Alumno por Nombre o Correo:
                        </label>

                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleInputChange}
                            placeholder="Ej: juan.perez@email.com"
                            className="px-3 py-2 border border-grisC rounded-md placeholder:text-grisM text-grisF focus:outline-none focus:ring-2 focus:ring-azulM"
                            autoComplete="off"
                        />

                        {/* SUGERENCIAS */}
                        <div className="absolute w-full mt-1 z-10">
                            {searchTerm.length >= 3 && !report && (
                                <div className="bg-white border border-grisM rounded-lg shadow-lg max-h-64 overflow-y-auto">

                                    {loading && (
                                        <p className="p-3 text-sm text-gray-500">
                                            Buscando sugerencias...
                                        </p>
                                    )}

                                    {!loading && suggestions.length === 0 && (
                                        <p className="p-3 text-sm text-gray-500">
                                            No se encontraron resultados.
                                        </p>
                                    )}

                                    {!loading && suggestions.map((student) => (
                                        <div
                                            key={student.id}
                                            onClick={() => handleSuggestionClick(student)}
                                            className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                                        >
                                            <div className="font-medium text-grisF">
                                                {student.first_name} {student.last_name}
                                            </div>
                                            <div className="text-sm text-gray-500">{student.email}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full md:w-auto px-6 py-3 bg-azulF text-white font-bold rounded-lg hover:bg-azulM"
                        disabled={loading}
                    >
                        {loading ? "Buscando..." : <Search size={20} />}
                    </button>
                </form>
            </div>

            {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg mb-4">{error}</div>
            )}

            {report && (
                <div className="bg-white p-6 rounded-xl shadow border">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h2 className="text-xl font-semibold text-grisF">
                            Reporte para: <span className="text-azulF">{report.student_name}</span>
                        </h2>

                        <button
                            onClick={handleExportCSV}
                            className="flex items-center text-sm px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                        >
                            <Download size={18} className="mr-1" />
                            Descargar CSV
                        </button>
                    </div>

                    <h3 className="text-lg font-medium text-grisF mb-3">Calificaciones:</h3>

                    {report.grades.length === 0 ? (
                        <p className="p-4 text-center text-gray-500 italic">
                            No hay calificaciones registradas.
                        </p>
                    ) : (
                        <table className="min-w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="p-2 border border-gray-300">Materia</th>
                                    <th className="p-2 border border-gray-300 text-center w-40">Calificación</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.grades.map((grade, i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="p-2 border border-gray-300">{grade.subject_name}</td>
                                        <td className="p-2 border border-gray-300 text-center font-bold text-red-600">
                                            {grade.score}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}

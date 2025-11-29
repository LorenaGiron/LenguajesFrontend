import React, { useState, useEffect, useMemo } from "react";
import { getTeacherSubjectLoad } from "../api/subject.ap.js";
import { getStudentsBySubject, getGradesBySubject } from "../api/grades.api.js";
import Button from "../components/ui/Button";
import { Search, ArrowUpDown, Award, AlertCircle, CheckCircle2, Download, TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function TeacherGradesSummary() {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState("");
    const [studentsData, setStudentsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: 'lastName', direction: 'ascending' });

    useEffect(() => {
        const loadSubjects = async () => {
            try {
                const data = await getTeacherSubjectLoad();
                setSubjects(data || []);
                if (data.length > 0) setSelectedSubjectId(data[0].id.toString());
            } catch (err) {
                console.error(err);
            }
        };
        loadSubjects();
    }, []);

    useEffect(() => {
        if (!selectedSubjectId) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const [students, grades] = await Promise.all([
                    getStudentsBySubject(selectedSubjectId),
                    getGradesBySubject(selectedSubjectId)
                ]);

                const gradesMap = grades.reduce((acc, g) => ({ ...acc, [g.student_id]: g.score }), {});

                const combined = students.map(s => ({
                    id: s.id,
                    name: s.first_name,
                    lastName: s.last_name,
                    fullName: `${s.first_name} ${s.last_name}`,
                    email: s.email,
                    score: gradesMap[s.id] ?? null
                }));
                setStudentsData(combined);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedSubjectId]);

    const classAverage = useMemo(() => {
        const scores = studentsData.map(s => s.score).filter(s => s !== null);
        if (scores.length === 0) return 0;
        const total = scores.reduce((a, b) => a + b, 0);
        return total / scores.length;
    }, [studentsData]);

    const processedData = useMemo(() => {
        let data = [...studentsData];

        if (searchTerm) {
            data = data.filter(s => 
                s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (sortConfig.key) {
            data.sort((a, b) => {
                let aVal = a[sortConfig.key];
                let bVal = b[sortConfig.key];

                if (sortConfig.key === 'deviation') {
                    aVal = a.score !== null ? a.score - classAverage : -Infinity;
                    bVal = b.score !== null ? b.score - classAverage : -Infinity;
                }

                if (sortConfig.key === 'score') {
                    if (aVal === null) return 1;
                    if (bVal === null) return -1;
                }

                if (aVal < bVal) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return data;
    }, [studentsData, searchTerm, sortConfig, classAverage]);

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const currentSubjectName = subjects.find(s => s.id.toString() === selectedSubjectId)?.name || 'Reporte';

    const handleDownloadCSV = () => {
        if (!processedData.length) return;

        const headers = ["ID", "Nombre Completo", "Email", "Calificación", "Vs Promedio", "Estado"];
        const rows = processedData.map(s => {
            let status = "Pendiente";
            let deviation = "N/A";
            
            if (s.score !== null) {
                status = s.score >= 70 ? "Aprobado" : "Reprobado";
                const diff = (s.score - classAverage).toFixed(2);
                deviation = diff > 0 ? `+${diff}` : diff;
            }

            return [
                s.id,
                `"${s.fullName}"`,
                s.email,
                s.score !== null ? s.score : "N/A",
                deviation,
                status
            ];
        });

        const csvContent = "\uFEFF" + [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Resumen_${currentSubjectName.replace(/\s+/g, '_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getStatusBadge = (score) => {
        if (score === null) return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600"><AlertCircle size={12} /> Pendiente</span>;
        if (score >= 70) return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle2 size={12} /> Aprobado</span>;
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"><AlertCircle size={12} /> Reprobado</span>;
    };

    const getDeviationBadge = (score) => {
        if (score === null) return <span className="text-gray-300">-</span>;
        
        const diff = score - classAverage;
        const formattedDiff = diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1);
        
        if (Math.abs(diff) < 0.1) return <span className="text-gray-500 text-xs font-bold flex items-center justify-center gap-1"><Minus size={12}/> Promedio</span>;
        
        if (diff > 0) return (
            <span className="text-green-600 text-xs font-bold flex items-center justify-center gap-1 bg-green-50 px-2 py-1 rounded-md">
                <TrendingUp size={12}/> {formattedDiff}
            </span>
        );
        
        return (
            <span className="text-red-500 text-xs font-bold flex items-center justify-center gap-1 bg-red-50 px-2 py-1 rounded-md">
                <TrendingDown size={12}/> {formattedDiff}
            </span>
        );
    };

    return (
        <div className="p-8 w-full max-w-6xl mx-auto my-8">
            <div className="mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-azulF">Resumen Académico</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Promedio del grupo: <span className="font-bold text-azulF">{classAverage.toFixed(2)}</span>
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-center">
                    <select 
                        value={selectedSubjectId}
                        onChange={(e) => setSelectedSubjectId(e.target.value)}
                        className="p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-azulF/50 outline-none w-full sm:w-auto min-w-[180px]"
                    >
                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>

                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Buscar alumno..." 
                            className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full sm:w-64 focus:ring-2 focus:ring-azulF/50 outline-none bg-gray-50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                     <Button 
                        onClick={handleDownloadCSV}
                        disabled={processedData.length === 0 || loading}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors w-full sm:w-auto justify-center whitespace-nowrap"
                        title="Descargar la vista actual en CSV"
                    >
                        <Download size={18} />
                        <span>Exportar CSV</span>
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-500 animate-pulse flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-4 border-azulF/30 border-t-azulF rounded-full animate-spin"></div>
                        Cargando datos...
                    </div>
                ) : processedData.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 bg-gray-50">
                        <AlertCircle size={40} className="mx-auto text-gray-300 mb-2"/>
                        No se encontraron registros para esta búsqueda.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/80 border-b border-gray-200">
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition select-none" onClick={() => handleSort('id')}>
                                        <div className="flex items-center gap-1">ID <ArrowUpDown size={14} className={`text-gray-400 ${sortConfig.key === 'id' ? 'text-azulF' : ''}`} /></div>
                                    </th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition select-none" onClick={() => handleSort('lastName')}>
                                        <div className="flex items-center gap-1">Alumno <ArrowUpDown size={14} className={`text-gray-400 ${sortConfig.key === 'lastName' ? 'text-azulF' : ''}`} /></div>
                                    </th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center cursor-pointer hover:bg-gray-100 transition select-none" onClick={() => handleSort('score')}>
                                        <div className="flex items-center justify-center gap-1">Calificación <ArrowUpDown size={14} className={`text-gray-400 ${sortConfig.key === 'score' ? 'text-azulF' : ''}`} /></div>
                                    </th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center cursor-pointer hover:bg-gray-100 transition select-none" onClick={() => handleSort('deviation')}>
                                        <div className="flex items-center justify-center gap-1">Vs Promedio <ArrowUpDown size={14} className={`text-gray-400 ${sortConfig.key === 'deviation' ? 'text-azulF' : ''}`} /></div>
                                    </th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center hidden md:table-cell">Progreso Visual</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {processedData.map((student) => (
                                    <tr key={student.id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="p-4 text-sm text-gray-500 font-mono">#{student.id}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${student.score >= 95 ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-400/30' : 'bg-gray-100 text-gray-600'}`}>
                                                    {student.name.charAt(0)}{student.lastName.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-1">
                                                        <p className="text-sm font-semibold text-gray-900">{student.fullName}</p>
                                                        {student.score >= 95 && <Award size={16} className="text-yellow-500 inline-block" title="Top Student" />}
                                                    </div>
                                                    <p className="text-xs text-gray-500">{student.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`text-lg font-bold ${student.score === null ? 'text-gray-300' : student.score >= 70 ? 'text-gray-800' : 'text-red-600'}`}>
                                                {student.score ?? '-'}
                                            </span>
                                            {student.score !== null && <span className="text-xs text-gray-400 block">/ 100</span>}
                                        </td>
                                        <td className="p-4 text-center">
                                            {getDeviationBadge(student.score)}
                                        </td>
                                        <td className="p-4 align-middle hidden md:table-cell">
                                            <div className="w-full max-w-[120px] mx-auto h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                                                <div 
                                                    className={`h-full rounded-full transition-all duration-500 ${student.score === null ? 'bg-transparent' : student.score >= 90 ? 'bg-green-500' : student.score >= 70 ? 'bg-blue-500' : 'bg-red-500'}`} 
                                                    style={{ width: `${student.score || 0}%` }}
                                                />
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            {getStatusBadge(student.score)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            
            <div className="mt-3 text-right text-xs text-gray-500 flex justify-end items-center gap-1">
                <CheckCircle2 size={14} className="text-green-600"/>
                Mostrando {processedData.length} de {studentsData.length} registros
            </div>
        </div>
    );
}
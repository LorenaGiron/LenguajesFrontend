import React, { useState, useEffect, useMemo } from "react";
import { getTeacherSubjectLoad, getSubjectGradesReport } from "../api/subject.ap.js";
import { ArrowLeftCircle, ArrowRightCircle, BarChart2, Users, CheckCircle, XCircle, ChartColumn , ClipboardList, TrendingUp, TrendingDown } from "lucide-react";

const PASSING_THRESHOLD = 70;

const COLOR_MAP = {
    average: "gray-700",
    highest: "green-700",
    lowest: "red-700",
    enrolled: "gray-700",
    passed: "green-700",
    failed: "red-700",
    pending: "gray-700",
};

const StatsCard = ({ title, value, icon: Icon, color }) => (
    <div className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white h-full flex flex-col justify-center transition-transform hover:scale-[1.01]">
        <div className="flex justify-between items-center">
            <div>
                <p className="text-lg font-semibold text-gray-500 mb-2">{title}</p>
                <h3 className={`text-4xl font-extrabold text-${color}`}>{value}</h3>
            </div>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center bg-${color}/10`}>
                <Icon size={40} className={`text-${color}`} />
            </div>
        </div>
    </div>
);

export default function TeacherReportsPage() {
    const [subjects, setSubjects] = useState([]);
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);

    useEffect(() => {
        const loadSubjects = async () => {
            setLoading(true);
            try {
                const data = await getTeacherSubjectLoad();
                setSubjects(data || []);
                if (data && data.length > 0) setCurrentSubjectIndex(0);
                else setLoading(false);
            } catch (err) {
                setError("Error al cargar la lista de materias: " + err.message);
                setLoading(false);
            }
        };
        loadSubjects();
    }, []);

    useEffect(() => {
        const fetchReport = async () => {
            if (subjects.length === 0) return;
            const currentSubject = subjects[currentSubjectIndex];

            setError(null);
            setReportData(null);
            setLoading(true);

            try {
                const data = await getSubjectGradesReport(currentSubject.id);

                const scores = data.students_with_grades
                    .map(s => s.score)
                    .filter(score => score !== null && !isNaN(score));

                setReportData({
                    subjectName: currentSubject.name,
                    totalStudentsEnrolled: currentSubject.student_count || 0,
                    scores,
                });
            } catch (err) {
                setError(`Error al cargar el reporte de notas para ${currentSubject.name}: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        if (subjects.length > 0) fetchReport();
    }, [subjects, currentSubjectIndex]);

    const stats = useMemo(() => {
        if (!reportData || reportData.scores.length === 0) return null;

        const { scores, totalStudentsEnrolled } = reportData;
        const gradedCount = scores.length;
        const totalScore = scores.reduce((sum, score) => sum + score, 0);

        const average = (totalScore / gradedCount).toFixed(2);
        const highest = Math.max(...scores);
        const lowest = Math.min(...scores);
        const passed = scores.filter(score => score >= PASSING_THRESHOLD).length;
        const failed = gradedCount - passed;
        const pending = totalStudentsEnrolled - gradedCount;
        const percentagePassed = ((passed / gradedCount) * 100).toFixed(1);
        
        return {
            average,
            highest,
            lowest,
            passed,
            failed,
            pending,
            gradedCount,
            percentagePassed,
            totalStudentsEnrolled,
        };
    }, [reportData]);

    const handleNext = () => {
        if (subjects.length > 0) {
            setCurrentSubjectIndex((prevIndex) => (prevIndex + 1) % subjects.length);
        }
    };

    const handlePrev = () => {
        if (subjects.length > 0) {
            setCurrentSubjectIndex((prevIndex) => (prevIndex - 1 + subjects.length) % subjects.length);
        }
    };

    const currentSubject = subjects[currentSubjectIndex];
    const subjectDisplayName = currentSubject ? currentSubject.name : "Sin Materias";

    if (error) 
        return <div className="p-8 text-center bg-red-100 text-red-700 h-screen flex items-center justify-center">{error}</div>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-semibold text-azulF mb-2 flex items-center gap-3">
                <BarChart2 size={28} /> Estadísticas generales
            </h1>
            <p className="text-grisF mb-6">
                Consulta las estadísticas de calificaciones por materia.
            </p>

            <div className="bg-white p-4 rounded-xl shadow border mb-8 flex items-center justify-between">
                <button
                    onClick={handlePrev}
                    disabled={subjects.length <= 1 || loading}
                    className="p-3 text-azulF hover:text-azulM disabled:text-gray-300 transition hover:bg-gray-100 rounded-full"
                >
                    <ArrowLeftCircle size={32} />
                </button>

                <h3 className="text-2xl font-bold text-azulF text-center px-4 uppercase tracking-wide">
                    {subjectDisplayName}
                </h3>

                <button
                    onClick={handleNext}
                    disabled={subjects.length <= 1 || loading}
                    className="p-3 text-azulF hover:text-azulM disabled:text-gray-300 transition hover:bg-gray-100 rounded-full"
                >
                    <ArrowRightCircle size={32} />
                </button>
            </div>

            {loading && subjects.length > 0 && !stats && (
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-xl text-gray-500 animate-pulse">Obteniendo métricas...</p>
                </div>
            )}

            {!loading && stats ? (
                <div className="flex flex-col gap-6 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1">
                        <StatsCard 
                            title="Promedio General"
                            value={stats.average}
                            icon={ChartColumn}
                            color={COLOR_MAP.average}
                        />
                        <StatsCard 
                            title="Calificación Máxima"
                            value={stats.highest}
                            icon={TrendingUp}
                            color={COLOR_MAP.highest}
                        />
                        <StatsCard 
                            title="Calificación Mínima"
                            value={stats.lowest}
                            icon={TrendingDown}
                            color={COLOR_MAP.lowest}
                        />
                        <StatsCard 
                            title="Total Inscritos"
                            value={stats.totalStudentsEnrolled}
                            icon={Users}
                            color={COLOR_MAP.enrolled}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
                        <StatsCard 
                            title="Aprobados"
                            value={`${stats.passed} (${stats.percentagePassed}%)`}
                            icon={CheckCircle}
                            color={COLOR_MAP.passed}
                        />
                        <StatsCard 
                            title="Reprobados"
                            value={stats.failed}
                            icon={XCircle}
                            color={COLOR_MAP.failed}
                        />
                        <StatsCard 
                            title="Pendientes (sin nota)"
                            value={stats.pending}
                            icon={ClipboardList}
                            color={COLOR_MAP.pending}
                        />
                    </div>
                </div>
            ) : !loading && subjects.length > 0 && !stats ? (
                <div className="flex-1 flex items-center justify-center bg-white rounded-xl shadow border">
                    <p className="text-xl text-gray-500 italic">
                        No hay calificaciones registradas para esta materia.
                    </p>
                </div>
            ) : !loading && subjects.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-xl text-gray-500 italic">
                        No tienes materias asignadas para generar reportes.
                    </p>
                </div>
            ) : null}
        </div>
    );
}
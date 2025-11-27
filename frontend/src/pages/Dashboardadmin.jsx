

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { useNavigate } from "react-router-dom";

import { getTotalStudents } from "../api/students.api.js";
import { getTotalSubjects } from "../api/subject.ap.js";
import { getTotalProfessors } from "../api/users.api.js";

export default function DashboardAdmin() {
   
    const navigate = useNavigate(); 
    const [stats, setStats] = useState({
        students: '...',
        professors: '...',
        subjects: '...',
    });
    const [error, setError] = useState(null);

    useEffect(() => {

      
        const fetchStats = async () => {
            try {
                // Fetch de datos en paralelo
                const [totalStudents, totalProfessors, totalSubjects] = await Promise.all([
                    getTotalStudents(),
                    getTotalProfessors(),
                    getTotalSubjects(),
                ]);

                setStats({
                    students: totalStudents,
                    professors: totalProfessors,
                    subjects: totalSubjects,
                });
            } catch (err) {
                console.error("Error fetching dashboard stats:", err);
                setError("Error al cargar las estadísticas del panel.");
                setStats({
                    students: 'N/A',
                    professors: 'N/A',
                    subjects: 'N/A',
                });
            }
        };

        fetchStats();
    }, []);

   
    const handleRegisterStudent = () => navigate("/admin/register-student");
    const handleRegisterProfessor = () => navigate("/admin/register-professor");
    const handleRegisterSubject = () => navigate("/admin/register-materia");


    return (
        <div className="flex h-screen bg-grisC">
            <Sidebar />

            <div className="flex flex-col flex-1"> 
                <Topbar />

                {/* Contenido principal */}
                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="mb-10">
                        <h1 className="text-3xl font-semibold text-azulF">
                            Panel Administrativo
                        </h1>
                        <p className="text-grisF mt-1">
                            Bienvenido/a al centro de control del Sistema de Gestión Escolar.
                        </p>
                    </div>
                    
                    {error && (
                         <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-lg">
                            {error}
                         </div>
                    )}

                    {/* Tarjetas de estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                            <h3 className="text-azulF text-xl font-semibold">Estudiantes</h3>
                            <p className="text-4xl font-bold mt-3 text-gray-700">{stats.students}</p>
                            <p className="text-sm text-gray-500 mt-1">Registrados actualmente</p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                            <h3 className="text-azulF text-xl font-semibold">Profesores</h3>
                            <p className="text-4xl font-bold mt-3 text-gray-700">{stats.professors}</p>
                            <p className="text-sm text-gray-500 mt-1">Activos en el sistema</p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                            <h3 className="text-azulF text-xl font-semibold">Materias</h3>
                            <p className="text-4xl font-bold mt-3 text-gray-700">{stats.subjects}</p>
                            <p className="text-sm text-gray-500 mt-1">Disponibles este ciclo</p>
                        </div>
                    </div>

                    {/* Acciones rápidas */}
                    <section>
                        <h2 className="text-2xl font-semibold text-azulF mb-4">
                            Acciones rápidas
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <button 
                                onClick={handleRegisterStudent} // ASIGNAR FUNCIÓN
                                className="bg-azulF text-white p-5 rounded-xl shadow hover:bg-azulM transition"
                            >
                                Registrar nuevo estudiante
                            </button>

                            <button 
                                onClick={handleRegisterProfessor} // ASIGNAR FUNCIÓN
                                className="bg-azulF text-white p-5 rounded-xl shadow hover:bg-azulM transition"
                            >
                                Registrar nuevo profesor
                            </button>

                            <button 
                                onClick={handleRegisterSubject} 
                                className="bg-azulF text-white p-5 rounded-xl shadow hover:bg-azulM transition"
                            >
                                Crear nueva materia
                            </button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}
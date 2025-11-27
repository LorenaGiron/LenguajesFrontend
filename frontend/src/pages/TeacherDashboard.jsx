import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function TeacherDashboard() {
  const { user } = useAuth();

  
  const [stats] = useState({
    totalStudents: 0,
    pendingGrades: 0,
  });



  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-azulF">
          Bienvenido, {user?.full_name}
        </h1>
        <p className="text-grisF mt-2">
          Panel de control para gestionar tus calificaciones
        </p>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        {/* Total Alumnos */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-grisF font-medium">Total Alumnos</p>
              <h2 className="text-4xl font-bold text-azulF mt-2">
                {stats.totalStudents}
              </h2>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 8.646 4 4 0 010-8.646M9 9H3v12a6 6 0 0012 0v-3m0 0h6v-3a6 6 0 00-6-6m0 0V4m0 6v3" />
              </svg>
            </div>
          </div>
        </div>

        {/* Calificaciones Pendientes */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-grisF font-medium">Calificaciones Pendientes</p>
              <h2 className="text-4xl font-bold text-azulF mt-2">
                {stats.pendingGrades}
              </h2>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

      </div>

      {/* Acciones Rápidas */}
      <div className="bg-white p-6 rounded-xl shadow border mb-8">
        <h2 className="text-xl font-semibold text-azulF mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/profesor/calificaciones/capturar"
            className="p-4 bg-azulM text-white rounded-lg hover:bg-azulF transition text-center font-medium"
          >
             Capturar Calificaciones
          </a>
          <a
            href="/profesor/alumnos"
            className="p-4 bg-azulM text-white rounded-lg hover:bg-azulF transition text-center font-medium"
          >
             Ver Alumnos
          </a>
          <a
            href="/profesor/reportes/materia"
            className="p-4 bg-azulM text-white rounded-lg hover:bg-azulF transition text-center font-medium"
          >
             Ver Reportes
          </a>
        </div>
      </div>
    </div>
  );
}

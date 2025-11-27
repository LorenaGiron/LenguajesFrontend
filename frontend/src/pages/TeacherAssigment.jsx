// src/pages/TeacherLoadPage.jsx

import React, { useState, useEffect } from "react";
import { Users, BookOpen } from "lucide-react";
import { getProfessors } from "../api/users.api.js";
import { getTeacherSubjectLoad } from "../api/subject.ap.js"; // IMPORTACIÓN CAMBIADA

export default function TeacherLoadPage() {
    
    const [professors, setProfessors] = useState([]);
    const [selectedTeacherId, setSelectedTeacherId] = useState('');
    const [subjects, setSubjects] = useState([]);
    
    const [loadingProfessors, setLoadingProfessors] = useState(true);
    const [loadingSubjects, setLoadingSubjects] = useState(false);
    const [error, setError] = useState(null);

    // 1. Cargar lista de profesores al inicio (Sin cambios)
    useEffect(() => {
        const loadProfessors = async () => {
            try {
                const data = await getProfessors();
                setProfessors(data);
                setSelectedTeacherId(''); 
            } catch (err) {
                setError(`Error al cargar la lista de profesores: ${err.message}`);
            } finally {
                setLoadingProfessors(false);
            }
        };
        loadProfessors();
    }, []);

   
    useEffect(() => {
        if (!selectedTeacherId) {
            setSubjects([]);
            return;
        }

        const loadSubjectsForTeacher = async () => {
            setLoadingSubjects(true);
            setError(null);
            setSubjects([]);
            try {
                
                const data = await getTeacherSubjectLoad(selectedTeacherId); 
                setSubjects(data);
            } catch (err) {
                setError(`Error al cargar las materias del profesor: ${err.message}`);
            } finally {
                setLoadingSubjects(false);
            }
        };
        loadSubjectsForTeacher();
    }, [selectedTeacherId]);
    
    const selectedTeacher = professors.find(p => String(p.id) === selectedTeacherId);

    const handleSelectChange = (e) => {
        setSelectedTeacherId(e.target.value);
    };


    return (
        <div className="p-8">
            <h1 className="text-3xl font-semibold text-azulF mb-4 flex items-center gap-3">
                <Users size={28} /> Carga Académica de Profesores
            </h1>
            <p className="text-grisF mb-8">
                Selecciona un profesor para ver las materias que tiene asignadas y el número de alumnos por materia.
            </p>
            
            {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg mb-4">{error}</div>}

            <div className="bg-white p-6 rounded-xl shadow border mb-8">
                <label htmlFor="teacher-select" className="block text-lg font-semibold text-grisF mb-2">
                    Seleccionar Profesor:
                </label>
                <div className="relative w-full md:w-1/2">
                    {loadingProfessors ? (
                        <p className="p-3 text-gray-500">Cargando lista de profesores...</p>
                    ) : (
                        <select
                            id="teacher-select"
                            value={selectedTeacherId}
                            onChange={handleSelectChange}
                            className="w-full p-3 border-2 border-grisM/50 rounded-lg focus:ring-2 focus:ring-azulM focus:border-azulM transition-shadow bg-white text-grisF"
                            disabled={professors.length === 0}
                        >
                            <option value="">-- Selecciona un Profesor --</option>
                            {professors.map((prof) => (
                                <option key={prof.id} value={prof.id}>
                                    {prof.full_name} ({prof.email})
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow border">
                <h2 className="text-xl font-semibold text-azulF mb-4 border-b pb-2 flex items-center gap-2">
                    <BookOpen size={20} /> Materias Asignadas: 
                    <span className="text-gray-600 font-normal">
                        {selectedTeacher ? selectedTeacher.full_name : "N/A"}
                    </span>
                </h2>

                {loadingSubjects ? (
                    <div className="text-center p-6 text-gray-500">Cargando materias...</div>
                ) : subjects.length === 0 && selectedTeacherId !== '' ? (
                    <p className="text-center p-6 text-gray-500 italic">
                        {selectedTeacher ? `${selectedTeacher.full_name} no tiene materias asignadas.` : "Selecciona un profesor para ver su carga académica."}
                    </p>
                ) : (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="p-2 border border-gray-300 w-16">ID</th>
                                <th className="p-2 border border-gray-300">Materia</th>
                                <th className="p-2 border border-gray-300 text-center w-40">Alumnos Totales</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map((subject) => (
                                <tr key={subject.id} className="hover:bg-gray-50">
                                    <td className="p-2 border border-gray-300">{subject.id}</td>
                                    <td className="p-2 border border-gray-300 font-medium">{subject.name}</td>
                                    <td className="p-2 border border-gray-300 text-center font-bold text-azulF">
                                        {subject.student_count}
                                    </td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
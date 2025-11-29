import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getTeacherSubjectLoad } from "../api/subject.ap.js";
import { getGradesBySubject } from "../api/grades.api";
import { Users, BookOpen, ClipboardList, TrendingUp, Calendar, ArrowLeft, ArrowRight } from "lucide-react";

const LOCAL_STORAGE_KEY = "teacher_marked_dates_calendar";

function NoteModal({ date, initialNote, onClose, onSave }) {
    const [note, setNote] = useState(initialNote);
    const dateDisplay = new Date(date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

    const handleSave = () => {
        onSave(date, note);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <div className="px-5 py-3 bg-azulF text-white rounded-t-xl">
                    <h2 className="text-lg font-semibold">Añadir Nota</h2>
                </div>

                <div className="p-4">
                    <p className="text-sm text-grisF mb-2 font-medium">Evento para: <span className="font-bold text-azulF">{dateDisplay}</span></p>
                    <textarea
                        className="w-full p-2 border border-grisM rounded-md h-24 focus:ring-azulM focus:border-azulM text-grisF"
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        placeholder="Escribe una pequeña nota (Max 100 caracteres)..."
                        maxLength={100}
                    />
                    <p className="text-xs text-gray-500 mt-1 text-right">{note.length}/100</p>
                </div>

                <div className="px-5 py-3 bg-gray-50 flex justify-end space-x-3 border-t">
                    <button onClick={onClose} className="px-4 py-2 text-grisF border border-grisM rounded-md hover:bg-grisC transition-colors">
                        Cancelar
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}

function TeacherCalendar() {
  const [markedDates, setMarkedDates] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {}; 
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [editingDate, setEditingDate] = useState(null);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(markedDates));
  }, [markedDates]);

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };
  
  const handleDateClick = (dateString, currentNote) => {
    setEditingDate({ date: dateString, note: currentNote });
  };

  const handleSaveNote = (dateString, newNote) => {
    if (newNote.trim()) {
      setMarkedDates(prev => ({ ...prev, [dateString]: newNote.trim() }));
    } else {
      setMarkedDates(prev => {
        const newDates = { ...prev };
        delete newDates[dateString];
        return newDates;
      });
    }
    setEditingDate(null);
  };
  
  const handleCloseModal = () => setEditingDate(null);

  const renderDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dayCells = [];
    
    const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    for (let i = 0; i < startDay; i++) {
        dayCells.push(<div key={`empty-start-${i}`} className="p-2 h-10"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const note = markedDates[dateString] || '';
      const isMarked = !!note;

      dayCells.push(
        <button
          key={dateString}
          onClick={() => handleDateClick(dateString, note)}
          className={`p-1 h-10 text-center text-sm font-medium transition relative overflow-hidden ${
            isMarked
              ? 'bg-red-500 text-white hover:bg-red-600 shadow-md'
              : 'bg-white text-grisF hover:bg-grisC/50'
          }`}
          title={isMarked ? `Nota: ${note}` : "Click para añadir nota"}
        >
          {day}
          {isMarked && (
              <span className="absolute bottom-0 left-0 right-0 h-1 bg-red-800" />
          )}
        </button>
      );
    }
    return dayCells;
  };
  
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  return (
    <>
    <div className="bg-white p-6 rounded-xl shadow border w-full max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold text-azulF mb-4 flex items-center gap-3">
            <Calendar size={20} /> Mi Calendario de Eventos
        </h3>
        
        <div className="flex justify-between items-center mb-4">
            <button onClick={prevMonth} className="p-2 text-grisF hover:bg-grisC rounded-full">
                <ArrowLeft size={20} />
            </button>
            <span className="text-xl font-bold text-azulF">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button onClick={nextMonth} className="p-2 text-grisF hover:bg-grisC rounded-full">
                <ArrowRight size={20} />
            </button>
        </div>

        <div className="grid grid-cols-7 text-center text-sm font-semibold text-gray-500 mb-2">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                <div key={day} className="p-2">{day}</div>
            ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
            {renderDays()}
        </div>
    </div>
    {editingDate && (
        <NoteModal 
            date={editingDate.date} 
            initialNote={editingDate.note}
            onClose={handleCloseModal}
            onSave={handleSaveNote}
        />
    )}
    </>
  );
}


export default function TeacherDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSubjects: 0,
    totalStudents: 0,
    pendingGrades: 0,
  });
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const subjectsData = await getTeacherSubjectLoad();
        
        let totalPending = 0;
        
        const gradesPromises = subjectsData.map(subject => 
            getGradesBySubject(subject.id).catch(() => ([]))
        );

        const allGrades = await Promise.all(gradesPromises);

        subjectsData.forEach((subject, index) => {
            const enrolledStudents = subject.students || [];
            const gradesForSubject = allGrades[index] || [];
            
            const studentsGradedIds = new Set(gradesForSubject.map(g => g.student_id));
            
            const pendingForSubject = enrolledStudents.length - studentsGradedIds.size;
            totalPending += pendingForSubject;
        });

        setStats({
          totalSubjects: subjectsData?.length || 0,
          totalStudents: subjectsData?.reduce((acc, s) => acc + (s.student_count || 0), 0) || 0,
          pendingGrades: totalPending,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleToggleCalendar = () => {
      setIsCalendarVisible(prev => !prev);
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-azulF">
            Bienvenido, {user?.full_name}
          </h1>
          <p className="text-grisF mt-2">
            Panel de control para gestionar tus calificaciones
          </p>
        </div>
        
        <button
            onClick={handleToggleCalendar}
            className="p-3 rounded-full bg-azulM text-white shadow-lg hover:bg-azulF transition-colors"
            title="Mostrar/Ocultar Calendario"
        >
            <Calendar size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-grisF font-medium">Mis Materias</p>
              <h2 className="text-4xl font-bold text-azulF mt-2">
                {stats.totalSubjects}
              </h2>
            </div>
            <div className="w-12 h-12 bg-azulC/10 rounded-full flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-azulM" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-grisF font-medium">Total Alumnos</p>
              <h2 className="text-4xl font-bold text-azulF mt-2">
                {stats.totalStudents}
              </h2>
            </div>
            <div className="w-12 h-12 bg-azulC/10 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-azulM" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-grisF font-medium">Calificaciones Pendientes</p>
              <h2 className="text-4xl font-bold text-red-600 mt-2">
                {stats.pendingGrades}
              </h2>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <ClipboardList className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border mb-8">
        <h2 className="text-xl font-semibold text-azulF mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/profesor/calificaciones/capturar"
            className="p-4 bg-azulF text-white rounded-lg hover:bg-azulM transition text-center font-medium flex items-center justify-center gap-2"
          >
             <ClipboardList size={20} /> Capturar Calificaciones
          </a>
          <a
            href="/profesor/alumnos"
            className="p-4 bg-azulF text-white rounded-lg hover:bg-azulM transition text-center font-medium flex items-center justify-center gap-2"
          >
             <Users size={20} /> Ver Alumnos
          </a>
          <a
            href="/profesor/reportes/materia"
            className="p-4 bg-azulF text-white rounded-lg hover:bg-azulM transition text-center font-medium flex items-center justify-center gap-2"
          >
             <TrendingUp size={20} /> Ver Reportes
          </a>
        </div>
      </div>
      
      {/* Renderizado Condicional del Calendario */}
      {isCalendarVisible && <TeacherCalendar />}

    </div>
  );
}
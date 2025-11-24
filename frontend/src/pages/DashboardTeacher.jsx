import { useAuth } from "../context/AuthContext";

export default function TeacherDashboard() {
    const { user } = useAuth(); // Obtenemos la info del usuario logueado

    return (
        <div style={{ padding: '20px', backgroundColor: '#E8F5E9', minHeight: '100vh' }}>
            <h1 style={{ color: '#1B5E20' }}>
                PANEL DEL PROFESOR 
            </h1>
            <p>Bienvenido, {user?.full_name || user?.email || 'Profesor Desconocido'}.</p>
            <p>Aquí puedes ver y capturar calificaciones de tus Materias asignadas.</p>
            <p>Rol: {user?.role}</p>
        </div>
    );
}
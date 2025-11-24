import { useAuth } from "../context/AuthContext";
// SOLO PARA HACER PRUEBAS NO ESTA COMPLETO

export default function AdminDashboard() {
    const { user } = useAuth(); // Obtenemos la info del usuario logueado

    return (
        <div style={{ padding: '20px', backgroundColor: '#F0F4F8', minHeight: '100vh' }}>
            <h1 style={{ color: '#004488' }}>
                ADMINISTRADOR 🔑
            </h1>
            <p>Bienvenido, {user?.full_name || user?.email || 'Admin Desconocido'}.</p>
            <p>Este es el panel con acceso a la gestión de Usuarios, Reportes y Configuraciones Globales.</p>
            <p>Rol: {user?.role}</p>
        </div>
    );
}
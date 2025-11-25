import { Bell, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Topbar() {
  const { logout } = useAuth();

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-grisC flex items-center justify-end px-6 shadow-sm z-40">
        <button
            className="p-2 hover:bg-gray-200 rounded-full transition"
            title="Notificaciones"
            >
            <Bell size={22} className="text-gray-700" />
        </button>

        <button
            onClick={logout}
            className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded-lg transition ml-4"
            title="Cerrar sesión"
            >
            <span className="text-gray-700 font-medium text-sm">Cerrar sesión</span>
        </button>
    </header>
  );
}

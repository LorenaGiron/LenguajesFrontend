import { LogOut  } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-grisC flex items-center justify-end px-6 shadow-sm z-40">

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded-lg transition ml-4"
        title="Cerrar sesión"
      >
        <LogOut size={18} className="text-gray-700" />
        <span className="text-gray-700 font-medium text-sm">Cerrar sesión</span>
      </button>
    </header>
  );
}
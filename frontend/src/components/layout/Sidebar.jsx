import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  UserCog,
  GraduationCap,
  BookOpen,
  Calendar,
  FileSpreadsheet,
  User,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Submenú reutilizable
const SidebarSection = ({ title, icon: Icon, items }) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2 text-white hover:bg-azulM/40"
      >
        <span className="flex items-center gap-3">
          {Icon && <Icon size={18} />}
          {title}
        </span>
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>

      {open && (
        <ul className="ml-6 mt-1 space-y-1">
          {items.map(({ label, path }, idx) => (
            <li key={idx}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `block px-3 py-1 rounded-md text-sm ${
                    isActive
                      ? "bg-azulM text-white"
                      : "text-azulC hover:bg-azulM/30"
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default function Sidebar() {
  const { user } = useAuth(); 
  const role = user?.role || "Alumno"; // por defecto alumno

  // ==============================
  // MENÚS POR ROL
  // ==============================
  const menus = {
    Admin: [
      {
        type: "simple",
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/admin/dashboard",
      },
      {
        type: "group",
        label: "Gestión de Usuarios",
        icon: Users,
        items: [
          { label: "Administradores", path: "/admin/usuarios/admins" },
          { label: "Profesores", path: "/admin/usuarios/profesores" },
          { label: "Alumnos", path: "/admin/usuarios/alumnos" },
        ],
      },
      {
        type: "group",
        label: "Gestión Académica",
        icon: GraduationCap,
        items: [
          { label: "Materias", path: "/admin/materias" },
          { label: "Secciones", path: "/admin/secciones" },
          { label: "Grupos", path: "/admin/grupos" },
        ],
      },
      {
        type: "simple",
        label: "Registrar Usuario",
        icon: UserCog,
        path: "/admin/register",
      },
    ],

    Profesor: [
      {
        type: "simple",
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/profesor/dashboard",
      },
      {
        type: "simple",
        label: "Mis Materias",
        icon: BookOpen,
        path: "/profesor/materias",
      },
      {
        type: "simple",
        label: "Lista de Alumnos",
        icon: Users,
        path: "/profesor/alumnos",
      },
      {
        type: "simple",
        label: "Calificaciones",
        icon: FileSpreadsheet,
        path: "/profesor/calificaciones",
      },
    ],

    Alumno: [
      {
        type: "simple",
        label: "Horario",
        icon: Calendar,
        path: "/alumno/horario",
      },
      {
        type: "simple",
        label: "Materias",
        icon: BookOpen,
        path: "/alumno/materias",
      },
      {
        type: "simple",
        label: "Calificaciones",
        icon: FileSpreadsheet,
        path: "/alumno/calificaciones",
      },
      {
        type: "simple",
        label: "Perfil",
        icon: User,
        path: "/alumno/perfil",
      },
    ],
  };

  const menuForRole = menus[role];

  return (
    <div className="h-screen w-64 bg-azulF text-white flex flex-col shadow-xl">

      {/* Header */}
      <div className="p-6 border-b border-azulM/40">
        <h2 className="text-xl font-semibold tracking-wide">{role}</h2>
        <p className="text-sm text-azulC">Sistema de Gestión Escolar</p>
      </div>

      {/* Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuForRole.map((item, i) => {
          if (item.type === "simple") {
            const Icon = item.icon;
            return (
              <NavLink
                key={i}
                to={item.path}
                className={({ isActive }) =>
                  `
                    flex items-center gap-3 px-4 py-2 rounded-lg transition
                    ${isActive ? "bg-azulM text-white" : "hover:bg-azulM/40"}
                  `
                }
              >
                <Icon size={20} />
                {item.label}
              </NavLink>
            );
          }

          if (item.type === "group") {
            return (
              <SidebarSection
                key={i}
                title={item.label}
                icon={item.icon}
                items={item.items}
              />
            );
          }

          return null;
        })}
      </nav>

      <div className="p-4 text-sm text-azulC border-t border-azulM/40">
        Universidad de Guanajuato
      </div>
    </div>
  );
}

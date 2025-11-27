import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardList,
  BarChart3,
  User,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import logo from '../../assets/logo.png';

export default function TeacherSidebar() {
  const { user } = useAuth();
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  // Menú específico para profesores (basado en requerimientos del proyecto)
  const profesorMenuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/profesor/dashboard",
      description: "Panel principal con estadísticas"
    },
    {
      title: "Mis Materias",
      icon: BookOpen,
      path: "/profesor/materias",
      description: "Materias asignadas para impartir"
    },
    {
      title: "Alumnos",
      icon: Users,
      path: "/profesor/alumnos",
      description: "Lista de alumnos inscritos en tus materias"
    },
    {
      title: "Calificaciones",
      icon: ClipboardList,
      submenu: [
        { 
          label: "Capturar calificaciones", 
          path: "/profesor/calificaciones/capturar",
          description: "Registrar notas de estudiantes"
        },
        { 
          label: "Consultar calificaciones", 
          path: "/profesor/calificaciones/consultar",
          description: "Ver historial de calificaciones"
        },
        { 
          label: "Reporte por alumno", 
          path: "/profesor/calificaciones/reporte-alumno",
          description: "Desempeño individual del estudiante"
        },
      ]
    },
    {
      title: "Reportes",
      icon: BarChart3,
      submenu: [
        { 
          label: "Estadísticas por materia", 
          path: "/profesor/reportes/materia",
          description: "Análisis de desempeño de la clase"
        },
        { 
          label: "Resumen de calificaciones", 
          path: "/profesor/reportes/resumen",
          description: "Consolidado de todas las notas"
        },
      ]
    },
    {
      title: "Mi Perfil",
      icon: User,
      path: "/profesor/perfil",
      description: "Configuración y datos personales"
    },
  ];

  return (
    <aside className="w-64 h-full bg-azulF text-white fixed left-0 top-0 shadow-xl flex flex-col">
      
      {/* Logo */}
      <div className="flex items-center justify-center gap-2 pb-4 border-b border-azulC">
        <img 
          src={logo} 
          alt="Logo Universidad Prisma" 
          className="w-40 h-40 object-contain"
        />
      </div>

      {/* Usuario actual */}
      <div className="px-4 py-3 border-b border-azulC bg-azulM">
        <p className="text-xs text-azulC">👤 Profesor</p>
        <p className="text-sm font-semibold truncate">{user?.full_name || "Usuario"}</p>
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">

        {profesorMenuItems.map((item, index) => (
          <div key={index}>
            
            {/* Item sin submenu */}
            {!item.submenu && (
              <Link
                to={item.path}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-azulM transition-all duration-200 group"
                title={item.description}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{item.title}</span>
              </Link>
            )}

            {/* Item con submenu */}
            {item.submenu && (
              <div>
                <button
                  onClick={() => toggleMenu(item.title)}
                  className="flex justify-between items-center w-full p-3 rounded-md hover:bg-azulM transition-all duration-200"
                  title={item.description}
                >
                  <span className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{item.title}</span>
                  </span>

                  {openMenu === item.title ? (
                    <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                  ) : (
                    <ChevronRight className="w-4 h-4 transition-transform duration-200" />
                  )}
                </button>

                {/* Submenú desplegable */}
                <div
                  className={`ml-8 flex flex-col space-y-1 overflow-hidden transition-all duration-300 ${
                    openMenu === item.title ? "max-h-48" : "max-h-0"
                  }`}
                >
                  {item.submenu.map((sub, i) => (
                    <Link
                      key={i}
                      to={sub.path}
                      className="p-2 text-xs hover:text-azulC hover:bg-azulM/30 rounded transition-all duration-200"
                      title={sub.description}
                    >
                      • {sub.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

      </nav>

      {/* Footer - Ayuda */}
      <div className="p-4 border-t border-azulC bg-azulM text-xs text-center">
        <p className="text-azulC">¿Necesitas ayuda?</p>
        <a href="mailto:soporte@escuela.com" className="hover:text-white transition">
          Contactar soporte
        </a>
      </div>

    </aside>
  );
}
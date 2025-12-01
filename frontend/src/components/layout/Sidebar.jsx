import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCog,
  BookOpen,
  FileChartColumn,
  GraduationCap,
  Calendar,
  BarChart3,
  FileText,
  ClipboardList,
  User,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import logo from '../../assets/logo.png';

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.role || "admin";
  console.log("USER EN SIDEBAR:", user);
  console.log("ROL DETECTADO:", role);

  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const menuItems = {
    admin: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        path: "/admin/dashboard",
      },
      {
        title: "Alumnos",
        icon: Users,
        submenu: [
          { label: "Lista de alumnos", path: "/admin/alumnos?view=list" },
          { label: "Registrar alumno", path: "/admin/register-student" },
          { label: "Asignar materias", path: "/admin/assign"  },
        ],
      },
      {
        title: "Profesores",
        icon: UserCog,
        submenu: [
          { label: "Lista de profesores", path: "/admin/profesores-list" },
          { label: "Registrar profesor", path: "/admin/register-professor" },
          { label: "Materias impartidas", path: "/admin/profesores/materias" },
        ],
      },
      {
        title: "Materias",
        icon: BookOpen,
        submenu: [
          { label: "Lista de materias", path: "/admin/materias" },
          { label: "Registrar materia", path: "/admin/register-materia" },
        ],
      },
      {
        title: "Reportes",
        icon: FileText,
        submenu: [
          { label: "Boleta individual", path: "/admin/reports?view=boleta" },
          // { label: "Estadísticas académicas", path: "/admin/reports?view=estadisticas" },
          { label: "Calificaciones por materia", path: "/admin/reports/subject-grades" },
        ],
      }
    ],

    profesor: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        path: "/profesor/dashboard",
      },
      {
        title: "Mis Materias",
        icon: BookOpen,
        path: "/profesor/materias",
      },
      {
        title: "Alumnos",
        icon: Users,
        path: "/profesor/alumnos",
      },
      {
        title: "Calificaciones",
        icon: ClipboardList,
        submenu: [
          { label: "Capturar calificaciones", path: "/profesor/calificaciones/capturar" },
          { label: "Reporte por alumno", path: "/profesor/calificaciones/reporte-alumno" },
        ],
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
        title: "Mi perfil",
        icon: User,
        path: "/profesor/perfil",
      },
    ],

    alumno: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        path: "/alumno/dashboard",
      },
      {
        title: "Mis Materias",
        icon: BookOpen,
        path: "/alumno/materias",
      },
      {
        title: "Mis Profesores",
        icon: UserCog,
        path: "/alumno/profesores",
      },
      {
        title: "Calificaciones",
        icon: GraduationCap,
        path: "/alumno/calificaciones",
      },
      {
        title: "Horario",
        icon: Calendar,
        path: "/alumno/horario",
      },
      {
        title: "Perfil",
        icon: User,
        path: "/alumno/perfil",
      },
    ],
  };

  const itemsToRender = menuItems[role];

  return (
    <aside className="w-64 h-screen bg-azulF text-white fixed left-0 top-0 shadow-xl flex flex-col">
      <div className="flex items-center justify-center gap-2 pb-4 border-b border-azulC">
        <img 
          src={logo} 
          alt="Logo Universidad Prisma" 
          className="w-40 h-40 object-contain"
        />
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">

        {itemsToRender.map((item, index) => (
          <div key={index}>
            {!item.submenu && (
              <Link
                to={item.path}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-azulM transition-all"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </Link>
            )}

            {item.submenu && (
              <div>
                <button
                  onClick={() => toggleMenu(item.title)}
                  className="flex justify-between items-center w-full p-3 rounded-md hover:bg-azulM transition-all"
                >
                  <span className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {item.title}
                  </span>

                  {openMenu === item.title ? (
                    <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                  ) : (
                    <ChevronRight className="w-4 h-4 transition-transform duration-200" />
                  )}
                </button>

                {/* SUBMENÚ DESPLEGABLE */}
                <div
                  className={`ml-10 flex flex-col space-y-1 overflow-hidden transition-all duration-300 ${
                    openMenu === item.title ? "max-h-40" : "max-h-0"
                  }`}
                >
                  {item.submenu.map((sub, i) => (
                    <Link
                      key={i}
                      to={sub.path}
                      className="p-2 text-sm hover:text-azulC transition-all"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

      </nav>
    </aside>
  );
}

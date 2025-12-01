import { useState, useEffect } from "react";
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
import logo from "../../assets/logo.png";

export default function TeacherSidebar() {
  const { user } = useAuth();
  const [openMenu, setOpenMenu] = useState(null);
  console.log("Usuario:", user);
  const [profilePhoto, setProfilePhoto] = useState(null);

  // Cargar foto de perfil desde localStorage
  useEffect(() => {
    const loadProfilePhoto = () => {
      const savedProfile = localStorage.getItem("teacherProfile");
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          if (parsed.photoPreview) {
            setProfilePhoto(parsed.photoPreview);
          } else {
            setProfilePhoto(null);
          }
        } catch (error) {
          console.error("Error al cargar foto de perfil:", error);
        }
      } else {
        setProfilePhoto(null);
      }
    };

    // Cargar al montar el componente
    loadProfilePhoto();

    // Escuchar cambios en localStorage (cuando se guarda el perfil)
    const handleStorageChange = (e) => {
      if (e.key === "teacherProfile" || e.key === null) {
        loadProfilePhoto();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    // También escuchar eventos personalizados (para cambios en la misma pestaña)
    window.addEventListener("teacherProfileUpdated", loadProfilePhoto);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("teacherProfileUpdated", loadProfilePhoto);
    };
  }, []);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const profesorMenuItems = [
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
        { label: "Calificaciones por alumno", path: "/profesor/calificaciones/reporte-alumno" },
      ],
    },
    {
      title: "Reportes",
      icon: BarChart3,
      submenu: [
        { label: "Estadísticas por materia", path: "/profesor/reportes/materia" },
        { label: "Resumen de calificaciones", path: "/profesor/reportes/resumen" },
      ],
    },
    {
      title: "Mi Perfil",
      icon: User,
      path: "/profesor/perfil",
    },
  ];

  return (
    <aside className="w-64 h-screen bg-azulF text-white fixed left-0 top-0 shadow-xl flex flex-col">

      {/* LOGO - igual que Admin */}
      <div className="flex items-center justify-center gap-2 pb-4 border-b border-azulC">
        <img 
          src={logo}
          alt="Logo Universidad Prisma"
          className="w-40 h-40 object-contain"
        />
      </div>

      {/* MENÚ */}
      {/* Usuario actual */}
      <div className="px-4 py-3 border-b border-azulC bg-azulM">
        <div className="flex items-center gap-3">
          {/* Foto de perfil */}
          <div className="flex-shrink-0">
            {profilePhoto ? (
              <img 
                src={profilePhoto} 
                alt="Foto de perfil" 
                className="w-12 h-12 rounded-full object-cover border-2 border-azulC"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-azulC flex items-center justify-center border-2 border-azulC">
                <User className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
          {/* Información del usuario */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-azulC">Profesor</p>
            <p className="text-sm font-semibold truncate">{user?.full_name || "Usuario"}</p>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">

        {profesorMenuItems.map((item, index) => (
          <div key={index}>

            {/* ITEMS SIN SUBMENU */}
            {!item.submenu && (
              <Link
                to={item.path}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-azulM transition-all"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </Link>
            )}

            {/* ITEMS CON SUBMENU */}
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
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
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

# 📚 Plataforma de Gestión Escolar - Frontend

Sistema web integral para la gestión administrativa y académica de instituciones educativas. Permite a **administradores** y **profesores** interactuar con funcionalidades especializadas para cada rol.

##  Características Principales

### Administrador
-  Dashboard con métricas generales
-  Gestión de profesores (CRUD completo)
-  Gestión de alumnos (CRUD completo)
-  Gestión de materias y asignaciones
-  Reportes y estadísticas por materia
-  Control de acceso a recursos

### Profesor
- Dashboard personalizado con materias asignadas
- Listado de alumnos por materia
-  Sistema completo de calificaciones
- Reportes de desempeño académico
- Perfil personalizable

### Autenticación
- Sistema de login/registro seguro
- Manejo de tokens JWT via Context API
- Rutas protegidas según rol de usuario
- Cierre de sesión

##  Tecnologías Utilizadas
### Frontend Framework
- **React 19** - Biblioteca UI con últimas features
- **Vite 7** - Build tool ultrarrápido
- **React Router v7** - Enrutamiento dinámico

### Estilos
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **DaisyUI 4.12** - Componentes preconstruidos para Tailwind
- **Colores Personalizados**: `azulF`, `azulC`, `azulM`, `grisF`, `grisC`

### HTTP y API
- **Axios 1.13** - Cliente HTTP
- **Base URL**: `http://localhost:8000/api/v1`

### Iconografía
- **Lucide React 0.554** - Librería de íconos modernos
- **React Icons 5.5** - Colección adicional de íconos

### Herramientas de Desarrollo
- **ESLint** - Linting de código
- **PostCSS + Autoprefixer** - Procesamiento de CSS

##  Estructura del Proyecto

```
frontend/
├── src/
│   ├── api/                    # Conexiones HTTP con backend
│   │   ├── auth.api.js         # Autenticación
│   │   ├── students.api.js     # Gestión de alumnos
│   │   ├── users.api.js        # Gestión de usuarios
│   │   ├── subject.api.js      # Gestión de materias
│   │   ├── grades.api.js       # Calificaciones (con mock data)
│   │   └── http.js             # Configuración de axios
│   │
│   ├── components/             # Componentes reutilizables
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx              # Sidebar para admin
│   │   │   ├── TeacherSidebar.jsx       # Sidebar para profesor
│   │   │   ├── Topbar.jsx               # Barra superior
│   │   │   ├── EditStudentModal.jsx     # Modal editar alumno
│   │   │   └── EditUserModal.jsx        # Modal editar usuario
│   │   │
│   │   ├── professors/
│   │   │   └── ProfessorForm.jsx        # Formulario registro profesor
│   │   │
│   │   ├── students/
│   │   │   ├── EditStudentModal.jsx     # Modal editar datos alumno
│   │   │   └── IndividualReport.jsx     # Reporte individual
│   │   │
│   │   ├── subject/
│   │   │   ├── SubjectForm.jsx          # Formulario de materia
│   │   │   ├── EditSubjectModal.jsx     # Modal editar materia
│   │   │   ├── AssignmentModal.jsx      # Modal asignar materia
│   │   │   └── SubjectGrades.jsx        # Tabla de calificaciones
│   │   │
│   │   └── ui/
│   │       ├── Button.jsx               # Botón estándar
│   │       ├── ButtonRed.jsx            # Botón rojo (peligro)
│   │       ├── Input.jsx                # Input reutilizable
│   │       ├── ActionStatusModal.jsx    # Modal de estado
│   │       ├── StatusModal.jsx          # Modal de estado simple
│   │       └── DeleteConfirmationModal.jsx
│   │
│   ├── context/                # Estado global
│   │   └── AuthContext.jsx     # Contexto de autenticación
│   │
│   ├── pages/                  # Páginas principales
│   │   ├── LandingPage.jsx     # Página de inicio
│   │   ├── LoginPage.jsx       # Página de login
│   │   │
│   │   ├── AdminPage.jsx       # Layout principal admin
│   │   ├── DashboardAdmin.jsx  # Dashboard admin
│   │   ├── TeachersPage.jsx    # Listado de profesores
│   │   ├── StudentsPage.jsx    # Listado de alumnos
│   │   ├── SubjectsPage.jsx    # Listado de materias
│   │   ├── ReportsPage.jsx     # Reportes admin
│   │   │
│   │   ├── RegisterStudent.jsx     # Registro de alumno
│   │   ├── RegisterTeacher.jsx     # Registro de profesor
│   │   │
│   │   ├── TeacherLayout.jsx       # Layout principal profesor
│   │   ├── TeacherDashboard.jsx    # Dashboard profesor
│   │   ├── TeacherSubjects.jsx     # Mis materias
│   │   ├── TeacherStudents.jsx     # Alumnos por materia
│   │   ├── TeacherGrades.jsx       # Sistema de calificaciones
│   │   ├── TeacherReports.jsx      # Reportes profesor
│   │   ├── TeacherProfile.jsx      # Perfil personalizable
│   │   ├── TeacherAssignGrade.jsx  # Captura de calificaciones
│   │   ├── TeacherStatsSubject.jsx # Estadísticas por materia
│   │   └── TeacherSummaryReport.jsx
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx       # Configuración de rutas (React Router)
│   │
│   ├── assets/                 # Recursos estáticos
│   │   └── (imágenes, etc.)
│   │
│   ├── App.jsx                 # Componente raíz
│   ├── App.css
│   ├── index.css              # Estilos globales
│   └── main.jsx               # Punto de entrada
│
├── public/                     # Archivos públicos
│   └── images/
│
├── package.json               # Dependencias del proyecto
├── vite.config.js            # Configuración de Vite
├── tailwind.config.js        # Configuración de Tailwind
├── postcss.config.js         # Configuración de PostCSS
├── eslint.config.js          # Configuración de ESLint
└── README.md                 # Este archivo
```

## Inicio Rápido

### Requisitos Previos
- **Node.js** 18.0.0 o superior
- **npm** 9.0.0 o superior (o `yarn`, `pnpm`)
- **Backend ejecutándose** en `http://localhost:8000`

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/LorenaGiron/LenguajesFrontend.git
   cd LenguajesFrontend/frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar servidor de desarrollo:**
```bash
npm run dev
```

La aplicación estará disponible en:
```
http://localhost:5173
```
(Vite asigna puertos alternativos 5174, 5175, etc. si 5173 está ocupado)


## Integración con Backend

### Endpoints Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/auth/login` | Autenticación de usuario |
| `POST` | `/auth/register` | Registro de nuevo usuario |
| `GET` | `/teachers/me/subjects` | Materias del profesor autenticado |
| `GET` | `/subjects/{id}/students` | Alumnos de una materia |
| `POST` | `/grades/save` | Guardar calificaciones |
| `GET` | `/grades/{subject_id}/{exam_id}` | Obtener calificaciones de examen |

**Base URL:** `http://localhost:8000/api/v1`

##  Sistema de Diseño

### Colores Personalizados
```css
--azul-f: #1E40AF    /* Azul fuerte */
--azul-c: #3B82F6    /* Azul claro */
--azul-m: #60A5FA    /* Azul medio */
--gris-f: #6B7280    /* Gris fuerte */
--gris-c: #D1D5DB    /* Gris claro */
```

### Componentes Reutilizables
- `<Button />` - Botón primario
- `<ButtonRed />` - Botón de acción destructiva
- `<Input />` - Campo de entrada personalizado
- `<StatusModal />` - Modales de estado
- `<DeleteConfirmationModal />` - Modal de confirmación

## Autenticación

La autenticación se gestiona mediante:
- **Context API** (`AuthContext.jsx`) - Estado global del usuario
- **JWT Tokens** - Almacenados en `sessionStorage`
- **Rutas Protegidas** - Control de acceso por rol

### Roles Disponibles
- `admin` - Acceso completo a funciones administrativas
- `profesor` - Acceso a módulo de profesor

## Recursos Adicionales

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router Documentation](https://reactrouter.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

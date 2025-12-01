# Plataforma de Gestión Escolar - Frontend

Proyecto desarrollado con React y Vite para la interfaz de usuario de un sistema escolar, incluyendo administración de estudiantes, profesores, materias, calificaciones y reportes académicos.

## Tabla de Contenidos

1. [Objetivos](#objetivos)
2. [Módulos Funcionales](#módulos-funcionales)
3. [Estructura de Carpetas](#estructura-de-carpetas)
4. [Endpoints Utilizados](#endpoints-utilizados)
5. [Tecnologías](#tecnologías)
6. [Instrucciones de Instalación](#instrucciones-de-instalación)
7. [Manual Técnico](#manual-técnico)
8. [Entregables Finales](#entregables-finales)

---

## Objetivos

### Propósitos de Aprendizaje

- Implementar una aplicación React moderna con arquitectura de componentes reutilizables
- Aplicar React Router para navegación y rutas protegidas
- Implementar autenticación y autorización en el frontend con Context API
- Gestionar estado global de la aplicación mediante React Context
- Consumir API RESTful completa con operaciones CRUD
- Desarrollar interfaces de usuario responsivas con Tailwind CSS
- Implementar componentes modulares y reutilizables

### Alcances del Proyecto

- Sistema de autenticación con manejo de tokens JWT
- Interfaz de administrador con gestión completa de usuarios, estudiantes y materias
- Interfaz de profesor con dashboard personalizado y gestión de calificaciones
- Sistema de reportes y estadísticas académicas
- Perfiles personalizables con foto de perfil
- Control de acceso basado en roles (admin/profesor)
- Diseño responsivo y moderno

---

## Módulos Funcionales

### Módulo de Autenticación
- Login de usuarios con validación de credenciales
- Manejo de tokens JWT almacenados en localStorage
- Protección de rutas mediante Context API
- Cierre de sesión y limpieza de estado

### Módulo de Administrador
- Dashboard con métricas generales del sistema
- Gestión completa de profesores (crear, leer, actualizar, eliminar)
- Gestión completa de alumnos (crear, leer, actualizar, eliminar)
- Gestión de materias con asignación de profesores
- Asignación de alumnos a materias
- Reportes y estadísticas por materia
- Control de acceso a recursos administrativos

### Módulo de Profesor
- Dashboard personalizado con materias asignadas
- Visualización de alumnos por materia
- Sistema completo de captura y gestión de calificaciones
- Reportes de desempeño académico individual y por materia
- Perfil personalizable con foto de perfil

### Módulo de Calificaciones
- Registro de calificaciones por estudiante y materia
- Consulta de calificaciones por estudiante
- Consulta de calificaciones por materia
- Actualización de calificaciones

### Módulo de Reportes
- Reporte académico individual por estudiante
- Promedio general de calificaciones
- Reporte de calificaciones por materia
- Estadísticas generales (total estudiantes, materias, profesores)

---

## Estructura de Carpetas

```
frontend/
├── src/
│   ├── api/                    # Capa de comunicación con backend
│   │   ├── auth.api.js         # Endpoints de autenticación
│   │   ├── users.api.js        # Endpoints de usuarios/profesores
│   │   ├── students.api.js     # Endpoints de estudiantes
│   │   ├── subject.ap.js       # Endpoints de materias
│   │   ├── grades.api.js       # Endpoints de calificaciones
│   │   └── http.js             # Configuración de axios
│   │
│   ├── components/             # Componentes reutilizables
│   │   ├── layout/             # Componentes de layout
│   │   │   ├── Sidebar.jsx              # Sidebar para admin
│   │   │   ├── TeacherSidebar.jsx       # Sidebar para profesor
│   │   │   ├── Topbar.jsx               # Barra superior
│   │   │   ├── EditStudentModal.jsx     # Modal editar alumno
│   │   │   └── EditUserModal.jsx        # Modal editar usuario
│   │   │
│   │   ├── professors/         # Componentes de profesores
│   │   │   └── ProfessorForm.jsx        # Formulario registro profesor
│   │   │
│   │   ├── students/           # Componentes de estudiantes
│   │   │   ├── EditStudentModal.jsx     # Modal editar datos alumno
│   │   │   └── IndividualReport.jsx     # Reporte individual
│   │   │
│   │   ├── subject/            # Componentes de materias
│   │   │   ├── SubjectForm.jsx          # Formulario de materia
│   │   │   ├── EditSubjectModal.jsx     # Modal editar materia
│   │   │   ├── AssignmentModal.jsx      # Modal asignar materia
│   │   │   └── SubjectGrades.jsx        # Tabla de calificaciones
│   │   │
│   │   └── ui/                  # Componentes UI reutilizables
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
│   │   ├── TeacherLayout.jsx       # Layout principal profesor
│   │   ├── TeacherDashboard.jsx    # Dashboard profesor
│   │   ├── TeacherSubjects.jsx     # Mis materias
│   │   ├── TeacherStudents.jsx     # Alumnos por materia
│   │   ├── TeacherGrades.jsx       # Sistema de calificaciones
│   │   ├── TeacherReports.jsx      # Reportes profesor
│   │   └── TeacherProfile.jsx      # Perfil personalizable
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx       # Configuración de rutas (React Router)
│   │
│   ├── assets/                 # Recursos estáticos
│   │   └── (imágenes, logos)
│   │
│   ├── App.jsx                 # Componente raíz
│   ├── App.css                 # Estilos del componente App
│   ├── index.css               # Estilos globales
│   └── main.jsx                # Punto de entrada
│
├── public/                     # Archivos públicos
│   └── images/                 # Imágenes públicas
│
├── package.json                # Dependencias del proyecto
├── vite.config.js              # Configuración de Vite
├── tailwind.config.js          # Configuración de Tailwind
├── postcss.config.js           # Configuración de PostCSS
├── eslint.config.js            # Configuración de ESLint
└── README.md                   # Este archivo
```

### Arquitectura del Frontend

```
┌─────────────────────────────────────────────────────────┐
│                    React Application                     │
│                      (main.jsx)                          │
└───────────────────────┬─────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
┌───────▼────────┐            ┌─────────▼────────┐
│  App Component │            │  AuthContext     │
│  (App.jsx)     │            │  (Global State) │
└───────┬────────┘            └─────────────────┘
        │
        │ React Router
        │
┌───────▼────────┐
│  Pages Layer   │
│  (pages/)      │
└───────┬────────┘
        │
        │ Components
        │
┌───────▼────────┐
│ Components     │
│ (components/)  │
└───────┬────────┘
        │
        │ API Calls
        │
┌───────▼────────┐
│  API Layer     │
│  (api/)        │
└───────┬────────┘
        │
        │ Axios HTTP
        │
┌───────▼────────┐
│  Backend API   │
│  (FastAPI)     │
└────────────────┘
```

---

## Endpoints Utilizados

### Autenticación
- `POST /api/v1/auth/login/access-token` - Iniciar sesión y obtener token JWT

### Usuarios
- `GET /api/v1/users/?role=profesor` - Listar profesores
- `GET /api/v1/users/me` - Obtener información del usuario autenticado
- `POST /api/v1/users/` - Crear nuevo usuario
- `PUT /api/v1/users/{user_id}` - Actualizar usuario
- `DELETE /api/v1/users/{user_id}` - Eliminar usuario

### Estudiantes
- `GET /api/v1/students/` - Listar estudiantes
- `POST /api/v1/students/` - Crear estudiante
- `PUT /api/v1/students/{id}` - Actualizar estudiante
- `DELETE /api/v1/students/{id}` - Eliminar estudiante

### Materias
- `GET /api/v1/subjects/` - Listar todas las materias
- `GET /api/v1/subjects/teacher-load/?teacher_id={id}` - Obtener carga académica de profesor
- `POST /api/v1/subjects/` - Crear materia
- `PUT /api/v1/subjects/{subject_id}` - Actualizar materia
- `PUT /api/v1/subjects/{subject_id}/students/` - Asignar estudiantes a materia
- `DELETE /api/v1/subjects/{subject_id}/students/{student_id}` - Remover estudiante de materia
- `DELETE /api/v1/subjects/{subject_id}` - Eliminar materia

### Calificaciones
- `POST /api/v1/grades/save` - Guardar calificaciones
- `GET /api/v1/grades/{subject_id}/{exam_id}` - Obtener calificaciones de examen

### Reportes
- `GET /api/v1/reports/stats/students` - Total de estudiantes
- `GET /api/v1/reports/stats/subjects` - Total de materias
- `GET /api/v1/reports/stats/professors` - Total de profesores

**Nota:** Todos los endpoints (excepto login) requieren autenticación mediante token Bearer en el header `Authorization`.

**Base URL:** `http://localhost:8000/api/v1`

---

## Tecnologías

### Lenguajes y Frameworks
- **JavaScript (ES6+)** - Lenguaje de programación
- **React 19.2.0** - Biblioteca UI para construir interfaces
- **Vite 7.2.4** - Build tool y servidor de desarrollo ultrarrápido
- **React Router DOM 7.9.6** - Enrutamiento dinámico

### Estilos
- **Tailwind CSS 3.4.18** - Framework CSS utility-first
- **DaisyUI 4.12.24** - Componentes preconstruidos para Tailwind
- **PostCSS 8.5.6** - Procesamiento de CSS
- **Autoprefixer 10.4.22** - Compatibilidad de navegadores

### HTTP y API
- **Axios 1.13.2** - Cliente HTTP para peticiones al backend

### Iconografía
- **Lucide React 0.554.0** - Librería de íconos modernos
- **React Icons 5.5.0** - Colección adicional de íconos

### Herramientas de Desarrollo
- **ESLint 9.39.1** - Linting de código
- **@types/react 19.2.5** - Tipos TypeScript para React
- **@types/react-dom 19.2.3** - Tipos TypeScript para React DOM

---

## Instrucciones de Instalación

### Requisitos Previos

- Node.js 18.0.0 o superior
- npm 9.0.0 o superior (o `yarn`, `pnpm`)
- Backend ejecutándose en `http://localhost:8000` (requerido para el funcionamiento completo)

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/LorenaGiron/LenguajesFrontend.git
cd LenguajesFrontend/frontend
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

### Paso 3: Verificar que el Backend esté Funcionando

El backend debe estar ejecutándose en `http://localhost:8000` para que el frontend funcione correctamente. Todas las funcionalidades requieren comunicación con la API del backend.

Asegúrate de que:
- El backend esté ejecutándose en `http://localhost:8000`
- La API esté accesible en `http://localhost:8000/api/v1`
- El backend tenga la base de datos configurada y migraciones aplicadas

### Paso 4: Ejecutar Servidor de Desarrollo

```bash
npm run dev
```

El servidor estará disponible en: `http://localhost:5173`

(Vite asigna puertos alternativos 5174, 5175, etc. si 5173 está ocupado)

### Paso 5: Acceder a la Aplicación

Abre tu navegador y navega a:
```
http://localhost:5173
```

**Importante:** Sin el backend funcionando, el frontend mostrará errores al intentar realizar operaciones que requieren comunicación con la API.

---

## Manual Técnico

### Configuración

#### Variables de Entorno

El frontend puede configurarse mediante variables de entorno. Crea un archivo `.env` en la carpeta `frontend/`:

```env
VITE_API_URL=http://localhost:8000
```

Si no se define, el frontend utilizará por defecto `http://localhost:8000` como base URL del backend.

#### Configuración de Axios

La configuración de Axios se encuentra en `src/api/http.js`:

```javascript
const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});
```

### Autenticación

El sistema utiliza JWT (JSON Web Tokens) para autenticación:

1. **Obtener token:**
   - El usuario inicia sesión mediante `POST /api/v1/auth/login/access-token`
   - El token se almacena en `localStorage` con la clave `access_token`

2. **Usar token en peticiones:**
   - El token se envía automáticamente en el header `Authorization: Bearer <token>`
   - La configuración se realiza en cada archivo de API mediante `getAuthHeaders()`

3. **Manejo de sesión:**
   - El estado de autenticación se gestiona mediante `AuthContext`
   - El usuario y rol se almacenan en el contexto global
   - Al cerrar sesión, se limpia el token y el estado del usuario

### Dependencias Principales

```json
{
  "dependencies": {
    "axios": "^1.13.2",
    "lucide-react": "^0.554.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-icons": "^5.5.0",
    "react-router-dom": "^7.9.6"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@types/react": "^19.2.5",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "autoprefixer": "^10.4.22",
    "daisyui": "^4.12.24",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.18",
    "vite": "^7.2.4"
  }
}
```

### Estructura de Componentes

Los componentes siguen una arquitectura modular:

- **Pages**: Componentes de página principales que representan rutas
- **Layout Components**: Componentes de estructura (Sidebar, Topbar)
- **Feature Components**: Componentes específicos de funcionalidad (forms, modals)
- **UI Components**: Componentes reutilizables de interfaz (buttons, inputs)

### Manejo de Estado

- **Context API**: Para estado global de autenticación (`AuthContext`)
- **useState**: Para estado local de componentes
- **localStorage**: Para persistencia de tokens y datos del perfil

### Rutas Protegidas

Las rutas están protegidas mediante React Router y el contexto de autenticación. Las rutas administrativas solo son accesibles para usuarios con rol `admin`, y las rutas de profesor solo para usuarios con rol `profesor`.

---
## Entregables Finales

### Backend (API)
- Código completo del backend con arquitectura en capas
- Autenticación JWT implementada
- Validaciones en cada endpoint con Pydantic
- Conexión a base de datos MySQL mediante SQLAlchemy
- Postman Collection exportada (disponible en el repositorio)
- Documentación completa de endpoints (métodos, parámetros, respuestas, errores, ejemplos)
- Documentación interactiva en `/docs` (Swagger UI) y `/redoc`

### Frontend
### Frontend (React)
- Código completo del frontend con arquitectura modular (components, context, api, pages)
- Autenticación JWT con Context API
- Consumo de API REST con Axios
- Interfaz con Tailwind CSS y DaisyUI
- Integración con todos los endpoints del backend (`/api/v1/*`)

### Documentación
- **README.md** - Documentación detallada del proyecto (este documento)
- **Modelo ER** - Diagrama entidad-relación de la base de datos (incluido en este README)
- **Diagramas de Arquitectura** - Diagramas de flujo y arquitectura del backend (incluidos en este README)
- **Script SQL** - Configuración completa de la base de datos MySQL
- **Manual de Usuario** - Screenshots y flujo de uso de la aplicación
- **Manual Técnico** - Configuración, dependencias y despliegue (incluido en este README)

### Video
- Demostración funcional del proyecto
- Contenido del video:
  - Login y autenticación
  - Flujo principal de la aplicación
  - CRUDs funcionando
  - Validaciones implementadas
  - Explicación rápida de la arquitectura

---


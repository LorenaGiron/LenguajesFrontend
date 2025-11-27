const API_BASE_URL = "http://localhost:8000/api/v1";

const getAuthHeaders = (contentType = false) => {
  const token = localStorage.getItem("access_token");
  const headers = { Authorization: token ? `Bearer ${token}` : "" };
  if (contentType) headers["Content-Type"] = "application/json";
  return headers;
};

// ============ DATOS MOCK (para desarrollo sin backend) ============
const MOCK_SUBJECTS = [
  {
    id: 1,
    name: "Matemáticas",
    code: "MAT-101",
    credits: 4,
    schedule: "Lunes y Miércoles 9:00-11:00",
    students: [
      {
        id: 1,
        first_name: "Juan",
        last_name: "Pérez",
        email: "juan@school.com",
        enrollment_code: "ENR-001",
        grades: [{ id: 1, grade: 8.5 }],
      },
      {
        id: 2,
        first_name: "María",
        last_name: "García",
        email: "maria@school.com",
        enrollment_code: "ENR-002",
        grades: [{ id: 2, grade: 9.2 }],
      },
      {
        id: 3,
        first_name: "Carlos",
        last_name: "López",
        email: "carlos@school.com",
        enrollment_code: "ENR-003",
        grades: [{ id: 3, grade: 7.0 }],
      },
    ],
  },
  {
    id: 2,
    name: "Física",
    code: "FIS-102",
    credits: 4,
    schedule: "Martes y Jueves 10:00-12:00",
    students: [
      {
        id: 1,
        first_name: "Juan",
        last_name: "Pérez",
        email: "juan@school.com",
        enrollment_code: "ENR-001",
        grades: [{ id: 4, grade: 7.8 }],
      },
      {
        id: 4,
        first_name: "Ana",
        last_name: "Rodríguez",
        email: "ana@school.com",
        enrollment_code: "ENR-004",
        grades: [{ id: 5, grade: 8.9 }],
      },
    ],
  },
  {
    id: 3,
    name: "Química",
    code: "QUI-103",
    credits: 3,
    schedule: "Miércoles y Viernes 1:00-3:00",
    students: [
      {
        id: 2,
        first_name: "María",
        last_name: "García",
        email: "maria@school.com",
        enrollment_code: "ENR-002",
        grades: [{ id: 6, grade: 9.0 }],
      },
      {
        id: 3,
        first_name: "Carlos",
        last_name: "López",
        email: "carlos@school.com",
        enrollment_code: "ENR-003",
        grades: [{ id: 7, grade: 6.5 }],
      },
    ],
  },
];

// ============ MATERIAS ============
export const getSubjectsForTeacher = async () => {
  try {
    const headers = getAuthHeaders(false);
    const res = await fetch(`${API_BASE_URL}/teachers/me/subjects`, { headers });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return await res.json();
  } catch {
    console.log("[MOCK] Usando datos simulados para materias");
    // Simular delay de red
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_SUBJECTS), 500));
  }
};

// ============ ALUMNOS ============
export const getStudentsForTeacher = async () => {
  try {
    const headers = getAuthHeaders(false);
    const res = await fetch(`${API_BASE_URL}/teachers/me/students`, { headers });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return await res.json();
  } catch {
    console.log("[MOCK] Usando datos simulados para alumnos");
    // Retornar todos los alumnos de todas las materias sin duplicados
    const allStudents = [];
    const seen = new Set();
    MOCK_SUBJECTS.forEach((subject) => {
      subject.students.forEach((student) => {
        if (!seen.has(student.id)) {
          seen.add(student.id);
          allStudents.push({
            ...student,
            subjects: MOCK_SUBJECTS.filter((s) =>
              s.students.some((st) => st.id === student.id)
            ),
          });
        }
      });
    });
    return new Promise((resolve) => setTimeout(() => resolve(allStudents), 500));
  }
};

export const getStudentsBySubject = async (subjectId) => {
  try {
    const headers = getAuthHeaders(false);
    const res = await fetch(
      `${API_BASE_URL}/subjects/${subjectId}/students`,
      { headers }
    );
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return await res.json();
  } catch {
    console.log("[MOCK] Usando datos simulados para alumnos por materia");
    const subject = MOCK_SUBJECTS.find((s) => s.id === parseInt(subjectId));
    return new Promise((resolve) =>
      setTimeout(() => resolve(subject?.students || []), 500)
    );
  }
};

// ============ CALIFICACIONES ============
export const createGrade = async (gradeData) => {
  try {
    const headers = getAuthHeaders(true);
    const res = await fetch(`${API_BASE_URL}/grades/`, {
      method: "POST",
      headers,
      body: JSON.stringify(gradeData),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || `Error ${res.status}`);
    }
    return await res.json();
  } catch {
    console.log("[MOCK] Calificación guardada en mock");
    return new Promise((resolve) =>
      setTimeout(() => resolve({ id: Math.random(), ...gradeData }), 300)
    );
  }
};

export const updateGrade = async (gradeId, gradeData) => {
  try {
    const headers = getAuthHeaders(true);
    const res = await fetch(`${API_BASE_URL}/grades/${gradeId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(gradeData),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || `Error ${res.status}`);
    }
    return await res.json();
  } catch {
    console.log("[MOCK] Calificación actualizada en mock");
    return new Promise((resolve) =>
      setTimeout(() => resolve({ id: gradeId, ...gradeData }), 300)
    );
  }
};

export const deleteGrade = async (gradeId) => {
  try {
    const headers = getAuthHeaders(true);
    const res = await fetch(`${API_BASE_URL}/grades/${gradeId}`, {
      method: "DELETE",
      headers,
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return await res.json();
  } catch {
    console.log("[MOCK] Calificación eliminada en mock");
    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 300));
  }
};

export default {
  getSubjectsForTeacher,
  getStudentsForTeacher,
  getStudentsBySubject,
  createGrade,
  updateGrade,
  deleteGrade,
};
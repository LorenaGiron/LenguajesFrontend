const API_BASE_URL = "http://localhost:8000/api/v1";

const getAuthHeaders = (contentType = false) => {
  const token = localStorage.getItem("access_token");
  const headers = { Authorization: token ? `Bearer ${token}` : "" };
  if (contentType) headers["Content-Type"] = "application/json";
  return headers;
};

export const getStudentsBySubject = async (subjectId) => {
  const headers = getAuthHeaders(false);
  const res = await fetch(`${API_BASE_URL}/subjects/${subjectId}/students`, { headers });
  
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return await res.json();
};

export const getGradesBySubject = async (subjectId) => {
    const headers = getAuthHeaders(false);
    const res = await fetch(`${API_BASE_URL}/grades/by-subject/${subjectId}`, { headers });
    
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return await res.json();
};

export const createGrade = async (gradeData) => {
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
};

export const updateGrade = async (gradeId, gradeData) => {
  const headers = getAuthHeaders(true);
  // Nota que usamos el ID en la URL y el método PUT
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
};


export const getSubjectsForTeacher = async () => {
  const headers = getAuthHeaders(false);
  const res = await fetch(`${API_BASE_URL}/subjects/teacher-load/`, { headers });
  
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return await res.json();
};

export default {
  getStudentsBySubject,
  getGradesBySubject,
  createGrade,
  updateGrade,
  getSubjectsForTeacher // Agregada al export por defecto también
};
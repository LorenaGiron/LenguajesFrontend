const API_BASE_URL = "http://localhost:8000/api/v1";

const getAuthHeaders = (contentType = false) => {
    const token = localStorage.getItem("access_token");
     // ✅ AHORA - Solo advierte en consola
    if (!token) {
        console.warn("⚠️ No hay token de autenticación. Algunas funciones pueden fallar.");
        return contentType ? { "Content-Type": "application/json" } : {};
    }
    const headers = { "Authorization": `Bearer ${token}` };
    if (contentType) {
        headers["Content-Type"] = "application/json";
    }
    return headers;
};

export const createSubject = async (subjectData) => {
    try {
        const headers = getAuthHeaders(true);
        const response = await fetch(`${API_BASE_URL}/subjects/`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(subjectData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: "Error desconocido." }));
            throw new Error(errorData.detail || `Error al registrar materia: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getSubjects = async () => {
    try {
        const headers = getAuthHeaders(false);
        const response = await fetch(`${API_BASE_URL}/subjects/`, { 
            headers: headers 
        });
        if (!response.ok) {
            throw new Error(`Error al cargar materias: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const updateSubject = async (subjectId, subjectData) => {
    try {
        const headers = getAuthHeaders(true);
        const response = await fetch(`${API_BASE_URL}/subjects/${subjectId}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(subjectData),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: "Error desconocido." }));
            throw new Error(errorData.detail || `Error al actualizar materia: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const deleteSubject = async (subjectId) => {
    try {
        const headers = getAuthHeaders(false);
        const response = await fetch(`${API_BASE_URL}/subjects/${subjectId}`, {
            method: 'DELETE',
            headers: headers,
        });
        if (!response.ok) {
            throw new Error(`Error al eliminar materia: ${response.statusText}`);
        }
        return true;
    } catch (error) {
        throw error;
    }
};

export async function assignStudentsToSubject(subjectId, studentIds) {
    try {
        const headers = getAuthHeaders(true);
        // NOTA: Reemplacé la llamada a 'api.put' por 'fetch' para ser consistente con el resto del código.
        const response = await fetch(`${API_BASE_URL}/subjects/${subjectId}/students/`, { 
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({ student_ids: studentIds }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: "Error desconocido." }));
            throw new Error(errorData.detail || `Error al asignar estudiantes: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export const removeStudentFromSubject = async (subjectId, studentId) => {
    try {
        const headers = getAuthHeaders(false);
        const response = await fetch(`${API_BASE_URL}/subjects/${subjectId}/students/${studentId}`, {
            method: 'DELETE',
            headers: headers,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: "Error desconocido." }));
            throw new Error(errorData.detail || `Error al eliminar estudiante de la materia: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};


/*export const getTeacherSubjectLoad = async (teacherId = null) => {
    try {
        const headers = getAuthHeaders(false);
        let url = `${API_BASE_URL}/subjects/teacher-load/`;
        
        // Si se proporciona un ID de profesor, se añade como query parameter
        if (teacherId !== null && teacherId !== "") {
            url += `?teacher_id=${teacherId}`;
        }
        
        const response = await fetch(url, { 
            headers: headers 
        });
        if (!response.ok) {
            throw new Error(`Error al cargar la carga académica: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};*/

export const getTotalSubjects = async () => { // NUEVA FUNCIÓN
    try {
        const headers = getAuthHeaders(false);
        const response = await fetch(`${API_BASE_URL}/reports/stats/subjects`, { 
            headers: headers 
        });

        if (!response.ok) {
            throw new Error(`Error al cargar el total de materias: ${response.status}`);
        }
        const data = await response.json();
        return data.total;
    } catch (error) {
        throw error;
    }
};



export const getSubjectGradesReport = async (subjectId) => {
    try {
        const headers = getAuthHeaders(false);
        const response = await fetch(`${API_BASE_URL}/reports/subject-grades/${subjectId}`, { 
            headers: headers 
        });

        if (!response.ok) {
            throw new Error(`Error al cargar el reporte de notas: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};



export const getTeacherSubjectLoad = async (teacherId = null) => {
    try {
        const headers = getAuthHeaders(false);
        let url = `${API_BASE_URL}/subjects/teacher-load/`;
        
        // Si se proporciona un ID de profesor, se añade como query parameter
        if (teacherId !== null && teacherId !== "") {
            url += `?teacher_id=${teacherId}`;
        }
        
        const response = await fetch(url, { 
            headers: headers 
        });
        if (!response.ok) {
            throw new Error(`Error al cargar la carga académica: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};
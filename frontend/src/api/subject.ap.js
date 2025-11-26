

const API_BASE_URL = "http://localhost:8000/api/v1"; 

// Función auxiliar para obtener los encabezados de autenticación
const getAuthHeaders = (contentType = false) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
        throw new Error("No hay token de autenticación disponible.");
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

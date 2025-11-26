const API_BASE_URL = "http://localhost:8000/api/v1";

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
export const createProfessor = async (userData) => {
    try {
        const headers = getAuthHeaders(true); 
        
       
        const response = await fetch(`${API_BASE_URL}/users/`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: "Error desconocido." }));
            throw new Error(errorData.detail || `Error al registrar: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getProfessors = async () => {
    try {
        const headers = getAuthHeaders(false);
        // Usamos el filtro 'role' en el query string
        const response = await fetch(`${API_BASE_URL}/users/?role=profesor`, { 
            headers: headers 
        });

        if (!response.ok) {
            throw new Error(`Error al cargar profesores: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};


export const updateProfessor = async (userId, userData) => {
    try {
        const headers = getAuthHeaders(true);
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: "Error desconocido." }));
            throw new Error(errorData.detail || `Error al actualizar (código ${response.status}).`);
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const deleteProfessor = async (userId) => {
    try {
        const headers = getAuthHeaders(false);
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'DELETE',
            headers: headers,
        });

        if (!response.ok) {
             const errorData = await response.json().catch(() => ({ detail: "Error desconocido." }));
             throw new Error(errorData.detail || `Error al eliminar (código ${response.status}).`);
        }
        return true; 
    } catch (error) {
        throw error;
    }
};
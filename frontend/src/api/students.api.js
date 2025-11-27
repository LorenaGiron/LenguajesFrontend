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


export const createStudent = async (studentData) => {
    try {
        const headers = getAuthHeaders(true); // Requiere Content-Type: application/json
        const response = await fetch(`${API_BASE_URL}/students/`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(studentData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: "Error desconocido." }));
            throw new Error(errorData.detail || `Error al crear (código ${response.status}).`);
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getStudents = async () => {
    try {
        const headers = getAuthHeaders(false);
        const response = await fetch(`${API_BASE_URL}/students/`, { 
            headers: headers 
        });

        if (!response.ok) {
            throw new Error(`Error al cargar alumnos: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error en getStudents:", error);
        throw error;
    }
};





export const updateStudent = async (studentId, studentData) => {
    try {
        const headers = getAuthHeaders(true); // Con Content-Type: application/json
        const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(studentData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: "Error desconocido." }));
            throw new Error(errorData.detail || `Error al actualizar (código ${response.status}).`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error en updateStudent:", error);
        throw error;
    }
};


export const deleteStudent = async (studentId) => {
    try {
        const headers = getAuthHeaders(false);
        const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
            method: 'DELETE',
            headers: headers,
        });

        if (response.status === 204) {
            
            return true; 
        }

        if (!response.ok) {
             const errorData = await response.json().catch(() => ({ detail: "Error desconocido." }));
             throw new Error(errorData.detail || `Error al eliminar (código ${response.status}).`);
        }
        
        return await response.json(); 

    } catch (error) {
        console.error("Error en deleteStudent:", error);
        throw error;
    }
};

export const getTotalStudents = async () => { // NUEVA FUNCIÓN
    try {
        const headers = getAuthHeaders(false);
        const response = await fetch(`${API_BASE_URL}/reports/stats/students`, { 
            headers: headers 
        });

        if (!response.ok) {
            throw new Error(`Error al cargar el total de alumnos: ${response.status}`);
        }
        const data = await response.json();
        return data.total;
    } catch (error) {
        throw error;
    }
};
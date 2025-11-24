import http from "./http";


export const loginRequest = async (email, password) => {
    const body = new URLSearchParams();
    body.append("username", email);
    body.append("password", password);

    // CORRECCIÓN: Agregamos "/api/v1" antes de /auth/...
    const response = await http.post("/api/v1/auth/login/access-token", body, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });

    return response.data;
};


export const getProfileRequest = async () => {
    const token = localStorage.getItem("token");
    const response = await http.get("/api/v1/users/me", {
        headers: {
          
            Authorization: `Bearer ${token}` 
        }
    });
    
    return response.data; 
};
import http from "./http";


export const loginRequest = async (email, password) => {
    const body = new URLSearchParams();
    body.append("username", email);
    body.append("password", password);

   
    const response = await http.post("/api/v1/auth/login/access-token", body, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });


    localStorage.setItem("access_token", response.data.access_token);

    return response.data;
};


export const getProfileRequest = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) { 
        throw new Error("Token no encontrado para perfil.");
    }
    const response = await http.get("/api/v1/users/me", {
        headers: {
          
            Authorization: `Bearer ${token}` 
        }
    });
    
    return response.data; 
};
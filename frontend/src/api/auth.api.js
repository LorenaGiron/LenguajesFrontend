import http from "./http";

export const loginRequest = async (email, password) => {
    const body = new URLSearchParams();
    body.append("username", email);
    body.append("password", password);

    const response = await http.post("/auth/login/access-token", body, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });

    return response.data;
};

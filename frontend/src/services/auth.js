import api from "./api";

export const register = async (username, email, password) => {
    const response = await api.post('/auth/register', {username, email, password});
    return response.data;
}

export const login = async (username, password) => {
    const response = await api.post('/auth/login', {username, password});
    return response.data;
};


export const getCurrentUser = async (token) => {
    const response = await api.get('/users/me', {headers: {Authorization: `Bearer ${token}`}});
    return response.data;
};
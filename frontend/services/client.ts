import axios from "axios";
import { getToken, saveToken, getRefreshToken } from "@/services/auth";
import { triggerSignOut } from "./authHandler";

// HTTP client centralized
const BASE_URL = 'http://10.0.2.2:8000';

export const apiClient = axios.create({ baseURL: BASE_URL,}); //my backend

apiClient.interceptors.request.use(async (config) => { //to add the token to the request
    const token = await getToken();
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});



apiClient.interceptors.response.use( //to manage the token expiration
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        let message = "Error inesperado";

        if(error.response){
            const {status, data} = error.response;

            if(status === 401 && !originalRequest._retry && !originalRequest.url?.includes("/auth/")){ //automatic token refresh when 401, not rety and not auth endpoint
                originalRequest._retry = true;
                try{
                    const refreshToken = await getRefreshToken();
                    if(!refreshToken){
                        throw new Error();
                    }

                    const {data: tokens} = await axios.post(`${BASE_URL}/auth/refresh`, {refresh_token: refreshToken});

                    await saveToken(tokens.access_token, tokens.refresh_token);
                    originalRequest.headers.Authorization = `Bearer ${tokens.access_token}`;

                    return apiClient(originalRequest);
                }catch{
                    await triggerSignOut();
                    return Promise.reject(new Error("Sesión expirada"));
                }
            }

            if(status === 401){
                message = originalRequest.url?.includes("/auth/signIn") ? "Credenciales inválidas" : "Sesión expirada";
                await triggerSignOut();
            }
            
            else if(status === 400){
                message = "Datos incorrectos";
            }

            else if(status === 403){
                message = "Acceso no autorizado";
            }

            else if(status >= 500){
                message = "Error en el servidor";
            }

            if(data?.detail && message === "Error inesperado"){
                if(typeof data.detail === "string"){
                    message = data.detail;
                }

                else if(Array.isArray(data.detail)){
                    message = data.detail.map((err: any) =>  `${err.loc.slice(1).join('.')}: ${err.msg}`).join("\n");
                }
            }
        }

        return Promise.reject(new Error(message));
    }
);
import axios from "axios";
import { getToken } from "@/services/auth";
import { triggerSignOut } from "./authHandler";

// HTTP client centralized

export const apiClient = axios.create({
    baseURL: 'http://10.0.2.2:8000', //my backend
});

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
        let message = "Error inesperado";

        if(error.response){
            const {status, data} = error.response;

            if(status === 401){
                const token = await getToken();
                if(token && !error.config.url?.includes("/auth/signIn")){
                    message = "Sesión expirada";
                    await triggerSignOut();
                }
                else{
                    message = "Credenciales inválidas";
                }
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

            if(data?.detail && message === "Error inesperdo"){
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
import axios from "axios";
import { getToken, removeToken } from "@/services/auth";
import { router } from "expo-router";

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
            
            if(data?.detail){
                if(typeof data.detail === "string"){
                    message = data.detail;
                }

                else if(Array.isArray(data.detail)){
                    message = data.detail.map((err: any) =>  `${err.loc.slice(1).join('.')}: ${err.msg}`).join("\n");
                }
            }

            else if(status === 400){
                message = "Datos incorrectos";
            }

            else if(status === 401){
                message = "Credenciales inválidas";
                await removeToken(); //delete expired token
                router.replace("/");
            }

            else if(status === 403){
                message = "Acceso no autorizado";
            }

            else if(status >= 500){
                message = "Error en el servidor";
            }
        }

        return Promise.reject(new Error(message));
    }
);
import axios from "axios";
import { getToken, saveToken, getRefreshToken } from "@/services/auth";
import { triggerSignOut } from "./authHandler";

// HTTP client centralized
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:8000';

export const apiClient = axios.create({ baseURL: BASE_URL, timeout: 10000}); //my backend

//to controle the concurrency
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

apiClient.interceptors.request.use(async (config) => { //to add the token to the request
    const token = await getToken();
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

apiClient.interceptors.response.use( //to manage errors
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        let message = "Error inesperado";

        if(!error.response){
            if(error.code === 'ECONNABORTED'){
                return Promise.reject(new Error("The server took too long to respond"));
            }

            return Promise.reject(new Error("No connection"));
        }

        if(error.response){
            const {status, data} = error.response;

            if(status === 401 && !originalRequest._retry && !originalRequest.url?.includes("/auth/")){ //automatic token refresh when 401, not retry and not auth endpoint
                //If there is another petition for refresh token, it queues
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                    .then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return apiClient(originalRequest); //retry
                    })
                    .catch(err => Promise.reject(err));
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try{
                    const refreshToken = await getRefreshToken();
                    if(!refreshToken){
                        throw new Error();
                    }

                    const {data: tokens} = await axios.post(`${BASE_URL}/auth/refresh`, {refresh_token: refreshToken});

                    await saveToken(tokens.access_token, tokens.refresh_token);
                    
                    processQueue(null, tokens.access_token);
                    
                    originalRequest.headers.Authorization = `Bearer ${tokens.access_token}`;
                    return apiClient(originalRequest);

                }catch(err){
                    processQueue(err, null);
                    await triggerSignOut();
                    return Promise.reject(new Error("Sesión expirada"));

                }finally {
                    isRefreshing = false;
                }
            }

            if(status === 401 && originalRequest.url?.includes("/auth/signIn")){
                return Promise.reject(new Error("Credenciales inválidas"));
            }

            if(status === 401){
                await triggerSignOut();
                return Promise.reject(new Error("Sesión expirada"));
            }
            
            if(status === 400 && message === "Error inesperado"){
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
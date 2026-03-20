import { createContext, useContext, useEffect, useState } from "react";
import { saveToken, getToken, removeToken } from "@/services/auth";
import { sHandler } from "@/services/authHandler";
import { useRouter } from "expo-router";
import { apiClient } from "@/services/client";

interface AuthContextType{
    isAuthenticated: boolean;
    loading: boolean;
    signOut: () => Promise<void>;
    signIn: (accessToken: string, refreshToken: string) => Promise<void>;
    refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({children}: {children: React.ReactNode}){
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const checkAuth = async () => {
        const token = await getToken();
        setIsAuthenticated(!!token);
        setLoading(false);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        sHandler(async () => {
            await removeToken();
            setIsAuthenticated(false);
            router.replace("/");
        });
    }, []);

    const signIn = async(accessToken: string, refreshToken: string) => {
        await saveToken(accessToken, refreshToken);
        setIsAuthenticated(true);
    };

    const signOut = async () => {
        try{
            await apiClient.post("/auth/signOut");
        }
        catch{
        }
        finally{
            await removeToken();
            setIsAuthenticated(false);
        }
    };

    const refreshAuth = async () => {
        await checkAuth();
    };

    return(
        <AuthContext.Provider value={{isAuthenticated, loading, signIn, signOut, refreshAuth}}>{children}</AuthContext.Provider>
    );
}

export function useAuth(){
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}
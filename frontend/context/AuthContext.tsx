import { createContext, useContext, useEffect, useState } from "react";
import { getToken, removeToken } from "@/services/auth";

interface AuthContextType{
    isAuthenticated: boolean;
    loading: boolean;
    signOut: () => Promise<void>;
    signIn: () => void;
    refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({children}: {children: React.ReactNode}){
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        const token = await getToken();
        setIsAuthenticated(!!token);
        setLoading(false);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const signIn = () => {
        setIsAuthenticated(true);
    };

    const signOut = async () => {
        await removeToken();
        setIsAuthenticated(false);
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
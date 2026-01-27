import React, {createContext, useState, useEffect} from 'react';
import * as SecureStore from 'expo-secure-store'

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [token, setToken] = useState(null); //save the token, at the begining is empty (no log)
    const [loading, setLoading] = useState(true); //its verifying if there is a save token

    useEffect(() => {
        const loadToken = async() => {
            try {
                const storedToken = await SecureStore.getItemAsync('access_token');
                if (storedToken){
                    setToken(storedToken);
                }

            } catch (error){
                console.error("Error loading token:", error);

            } finally {
                setLoading(false);
            }
        };

        loadToken();
    }, []);

    const login = async(jwt) => {
        try{
            setToken(jwt);
            await SecureStore.setItemAsync('access_token', jwt);

        } catch(error){
            console.error("Error saving token:", error);
        }
    };

    const logout = async() => {
        try{
            setToken(null);
            await SecureStore.deleteItemAsync('access_token');
        } catch(error){
            console.error("Error deleting token:", error);
        }
    };

    return (
    <AuthContext.Provider value={{token, login, logout, loading}}>
      {children}
    </AuthContext.Provider>
    );
};

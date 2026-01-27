import React, { useContext, useEffect, userState, useState } from "react";
import { View, Text, Button, ActivityIndicator, Alert } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { getCurrentUser } from "../services/auth";

export default function HomeScreen(){
    const {token, logout} = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(null);

    useEffect(() => {
        const fetchUser = async() => {
            try{
                const data = await getCurrentUser(token);
                setUser(data);

            } catch(error){
                Alert.alert("Error", "Could not fetch user data");

            } finally{
                setLoading(false);
            }
        };
        fetchUser();
    }, [token]);

    if(loading){
        return <ActivityIndicator size="large" style={{flex: 1, justifyContent: "center"}}/>
    }

    return(
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding:20}}>
            <Text style={{ fontSize: 20, marginBottom: 10 }}>Welcome!</Text>
            <Button title="Logout" onPress={logout}/>
        </View>
    );
}

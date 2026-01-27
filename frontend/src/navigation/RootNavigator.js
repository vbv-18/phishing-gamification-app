import React, {useContext} from "react"; //access to AuthContext
import {NavigationContainer} from '@react-navigation/native';
import { AuthContext } from "../context/AuthContext";
import AuthStack from './AuthStack';
import AppStack from './AppStack';

export default function RootNavigator() {
    const {token, loading} = useContext(AuthContext);
    if(loading){ //laoding page?
        return null;
    }

    return (
        <NavigationContainer>
            {token ? <AppStack /> : <AuthStack/>}
        </NavigationContainer>
    );
}

import React, { useState, useContext } from "react";
import { View, Text, Button, Alert, TextInput, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { AuthContext } from "../context/AuthContext";
import {login as loginAPI} from '../services/auth';

export default function LoginScreen({navigation}){
    const {login} = useContext(AuthContext);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async() => {
        try{
            const data = await loginAPI(username, password);

            if(data.access_token){
                login(data.access_token);
            }
            else{
                Alert.alert('Error: Invalid credentials');
            }
        } catch(error){
            if(error.response && error.response.status === 400){
                Alert.alert("Error:", error.response.data.detail);
            }
            else if(error.response && error.response.status == 422){
                Alert.alert("Error:",error.response.data.detail.map(d => d.msg).join('\n'));
            }
            else{
                Alert.alert("Error:", "Could not connect to the server")
            }
        }
    };

    return (
        <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScrollView contentContainerStyle={{flexGrow:1, justifyContent:'center', padding:20}}>
                <Text style={{fontSize:20, marginBottom:10}}>Login</Text>
                <TextInput
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    style={{borderWidth:1, marginBottom:10, padding:8}}
                />

                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    style={{borderWidth:1, marginBottom:10, padding:8}}
                />

                <Button
                    title="Log in"
                    onPress={handleLogin}
                />
                <View style={{marginTop:10}}>
                    <Button
                        title="Sign in"
                        onPress={() => navigation.navigate('Register')}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
import React, {useState} from 'react';
import { View, Text, TextInput, Button, Alert,  KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import {register as registerAPI} from '../services/auth';

export default function RegisterScreen({navigation}){
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async() => {
        try{
            await registerAPI(username, email, password); //create user in backend

            Alert.alert('User created successfully!');
            navigation.navigate('Login'); // go to login screen
        } catch(error){
            if(error.response && error.response.status === 400){
                Alert.alert("Error", error.response.data.detail);
            }
            else if(error.response && error.response.status == 422){
                Alert.alert("Error:",error.response.data.detail.map(d => d.msg).join('\n'));
            }
            else{
                Alert.alert("Error", "Could not connect to the server")
            }
        }
    };

    return(
        <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScrollView contentContainerStyle={{flexGrow:1, justifyContent:'center', padding:20}}>
                <Text style={{fontSize:20, marginBottom:10}}></Text>
                <TextInput
                    placeholder='Username'
                    value={username}
                    onChangeText={setUsername}
                    style={{borderWidth:1, marginBottom:10, padding:8}}
                />

                <TextInput
                    placeholder='Email'
                    value={email}
                    onChangeText={setEmail}
                    keyboardType='email-address'
                    style={{borderWidth:1, marginBottom:10, padding:8}}
                />

                <TextInput
                    placeholder='Password'
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={{borderWidth:1, marginBottom:10, padding:8}}
                />
                <Button title='Sign In' onPress={handleRegister}/>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
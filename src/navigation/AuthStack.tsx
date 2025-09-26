import React from "react";
// Usamos o 'createStackNavigator' aqui (presumindo que seja o 'stack')
import { createStackNavigator } from "@react-navigation/stack"; 
import Login from "../screens/Login";
import Register from "../screens/Register";

// Importamos a tipagem das telas do Stack de Autenticação
import { AuthStackParamList } from "./types"; // Crie este arquivo se não existir!

// Aplicamos a tipagem ao criador do Stack
const Stack = createStackNavigator<AuthStackParamList>(); 

interface AuthStackProps {
  onLogin: () => void;
}

export default function AuthStack({ onLogin }: AuthStackProps) {
  return (
    <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {(props) => <Login {...props} onLogin={onLogin} />}
      </Stack.Screen>
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
}
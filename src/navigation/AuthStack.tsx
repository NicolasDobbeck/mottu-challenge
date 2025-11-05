import React from "react";
import { createStackNavigator } from "@react-navigation/stack"; 
import Login from "../screens/Login";
import Register from "../screens/Register";

import { AuthStackParamList } from "./types";

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
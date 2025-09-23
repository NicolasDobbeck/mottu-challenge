// App.tsx
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./src/config/firebaseConfig";
import { queryClient } from "./react-query"; // Importe o queryClient
import Tabs from "./src/navigation/Tabs";
import AuthStack from "./src/navigation/AuthStack";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return null;
  }

  const handleLogin = () => {
    setIsLoggedIn(true);
    queryClient.invalidateQueries({ queryKey: ['userNomeSocial'] }); 
  };

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        {isLoggedIn ? (
          <Tabs onLogout={() => setIsLoggedIn(false)} />
        ) : (
          <AuthStack onLogin={handleLogin} />
        )}
      </NavigationContainer>
    </QueryClientProvider>
  );
}
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Tabs from './navigation/Tabs';
import Login from './screens/Login'; 

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, 
    },
    mutations: {
      retry: 1,
    },
  },
});

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const email = await AsyncStorage.getItem('userEmail');
        setIsLoggedIn(!!email);
      } catch (error) {
        console.error('Erro ao checar login:', error);
        setIsLoggedIn(false);
      }
    };
    checkLogin();
  }, []);

  const handleLogout = () => {
    AsyncStorage.multiRemove(['userEmail', 'userNomeSocial', 'userPassword']);
    setIsLoggedIn(false);
    queryClient.clear();
  };

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        {isLoggedIn ? (
          <Tabs onLogout={handleLogout} />
        ) : (
          <Login onLogin={() => setIsLoggedIn(true)} />
        )}
      </NavigationContainer>
    </QueryClientProvider>
  );
}
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Tabs from './navigation/Tabs';
import Login from './screens/Login';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tabs onLogout={() => setIsLoggedIn(false)} />
      ) : (
        <Login onLogin={() => setIsLoggedIn(true)} />
      )}
    </NavigationContainer>
  );
}
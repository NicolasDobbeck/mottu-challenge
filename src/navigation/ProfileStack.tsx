import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from '../screens/Profile';
import AccountSettings from '../screens/AccountSettings';
import { useTheme } from 'react-native-paper';

const Stack = createStackNavigator();

interface ProfileStackProps {
  onLogout: () => void;
  toggleTheme: () => void;
}

export default function ProfileStack({ onLogout, toggleTheme }: ProfileStackProps) {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.colors.background },
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
      }}
    >
      <Stack.Screen name="ProfileMain">
        {props => <Profile {...props} onLogout={onLogout} toggleTheme={toggleTheme} />}
      </Stack.Screen>
      <Stack.Screen 
        name="AccountSettings" 
        component={AccountSettings} 
        options={{
          headerShown: true,
          title: "Configurações da Conta",
        }}
      />
    </Stack.Navigator>
  );
}
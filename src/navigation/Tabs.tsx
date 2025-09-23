// src/navigation/Tabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Home from '../screens/Home';
import PatioMapping from '../screens/PatioMapping';
import RealtimeMap from '../screens/RealtimeMap';
import Developers from '../screens/Developers';
import Profile from '../screens/Profile';

const Tab = createBottomTabNavigator();

export default function Tabs({ onLogout }: { onLogout: () => void }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Pátio':
              iconName = 'grid';
              break;
            case 'Mapa':
              iconName = 'map';
              break;
            case 'Devs':
              iconName = 'people';
              break;
            case 'Perfil':
              iconName = 'person';
              break;
            default:
              iconName = 'alert-circle';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: '#05AF31',
        tabBarInactiveTintColor: '#9a9a9a',
        tabBarStyle: {
          backgroundColor: '#f9f9f9',
        }
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Pátio" component={PatioMapping} />
      <Tab.Screen name="Mapa" component={RealtimeMap} />
      <Tab.Screen name="Devs" component={Developers} />
      <Tab.Screen name="Perfil">
        {() => <Profile onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";

import Home from "../screens/Home";
import PatioMapping from "../screens/PatioMapping";
import RealtimeMap from "../screens/RealtimeMap";
import Developers from "../screens/Developers";
import ProfileStack from "./ProfileStack";
import FiliaisScreen from "../screens/FiliaisScreen";

const Tab = createBottomTabNavigator();

type TabsProps = {
  onLogout: () => void;
  toggleTheme: () => Promise<void> | void;
};

export default function Tabs({ onLogout, toggleTheme }: TabsProps) {
  const theme = useTheme();

  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          switch (route.name) {
            case "Home":
              iconName = "home-outline";
              break;
            case "Pátio":
              iconName = "grid-outline";
              break;
            case "Filiais":
              iconName = "business-outline";
              break;
            case "Mapa":
              iconName = "map-outline";
              break;
            case "Devs":
              iconName = "people-outline";
              break;

            case "Perfil":
              iconName = "person-outline";
              break;
            default:
              iconName = "alert-circle-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outlineVariant,
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Pátio" component={PatioMapping} />
      <Tab.Screen name="Filiais" component={FiliaisScreen} />   
      <Tab.Screen name="Mapa" component={RealtimeMap} />
      <Tab.Screen name="Devs" component={Developers} />
      <Tab.Screen name="Perfil">
        {() => <ProfileStack onLogout={onLogout} toggleTheme={toggleTheme} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
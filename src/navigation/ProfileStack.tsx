import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Profile from "../screens/Profile";
import AccountSettings from "../screens/AccountSettings";
import LanguageSettings from "../screens/LanguageSettings";
import { useTheme } from "react-native-paper";
import { t } from "../services/i18n";

const Stack = createStackNavigator();

interface ProfileStackProps {
  onLogout: () => void;
  toggleTheme: () => void;
}

export default function ProfileStack({
  onLogout,
  toggleTheme,
}: ProfileStackProps) {
  const theme = useTheme();

  return (
    <Stack.Navigator
      id={undefined}
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
        {(props) => (
          <Profile {...props} onLogout={onLogout} toggleTheme={toggleTheme} />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="AccountSettings"
        component={AccountSettings}
        options={{
          headerShown: true,
          title: t('accountSettings.title'),
        }}
      />

      <Stack.Screen
        name="LanguageSettings"
        component={LanguageSettings}
        options={{
          headerShown: true,
          title: t('profile.language'), // Reutiliza a tradução "Idioma"
        }}
      />
      
    </Stack.Navigator>
  );
}

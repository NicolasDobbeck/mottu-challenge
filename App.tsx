import React, { useState, useEffect, useMemo } from "react";
import { NavigationContainer, Theme, DefaultTheme } from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { onAuthStateChanged } from "firebase/auth";
import { Provider as PaperProvider, MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";

import { auth } from "./src/config/firebaseConfig";
import { queryClient } from "./react-query";
import Tabs from "./src/navigation/Tabs";
import AuthStack from "./src/navigation/AuthStack";

const customColors = {
    primary: '#05AF31', // Verde Mottu
    error: '#890e08',
};

const LightTheme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        ...customColors,
    },
};

const DarkTheme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        ...customColors,
    },
};

function paperToNavigationTheme(paperTheme: any): Theme {
  return {
    ...DefaultTheme,
    dark: !!paperTheme?.dark,
    colors: {
      ...DefaultTheme.colors,
      primary: paperTheme?.colors?.primary ?? DefaultTheme.colors.primary,
      background: paperTheme?.colors?.background ?? DefaultTheme.colors.background,
      card: paperTheme?.colors?.surface ?? DefaultTheme.colors.card,
      text: paperTheme?.colors?.onSurface ?? DefaultTheme.colors.text,
      border: paperTheme?.colors?.outline ?? DefaultTheme.colors.border,
      notification: paperTheme?.colors?.secondary ?? DefaultTheme.colors.notification,
    },
  };
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("theme");
        setIsDarkTheme(saved === "dark");
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setLoading(false);
    });
    return unsub;
  }, []);

  const paperTheme = useMemo(() => (isDarkTheme ? DarkTheme : LightTheme), [isDarkTheme]);
  const navTheme = useMemo(() => paperToNavigationTheme(paperTheme), [paperTheme]);

  const toggleTheme = async () => {
    const newValue = !isDarkTheme;
    setIsDarkTheme(newValue);
    try {
      await AsyncStorage.setItem("theme", newValue ? "dark" : "light");
    } catch (e) {
    }
  };

  // Tela de carregamento
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#05AF31" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={paperTheme}>
        <NavigationContainer theme={navTheme}>
          {isLoggedIn ? (
            <Tabs onLogout={() => setIsLoggedIn(false)} toggleTheme={toggleTheme} />
          ) : (
            <AuthStack onLogin={() => setIsLoggedIn(true)} />
          )}
        </NavigationContainer>
      </PaperProvider>
    </QueryClientProvider>
  );
}
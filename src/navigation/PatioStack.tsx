import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'react-native-paper';
import { t } from '../services/i18n';

import PatioListScreen from '../screens/PatioListScreen'; 
import MotoListScreen from '../screens/MotoListScreen';

// Define os parâmetros que uma tela pode passar para outra
export type PatioStackParamList = {
  PatioList: undefined; 
  MotoList: { patioId: string; patioName: string }; // A tela de motos recebe o ID e nome do pátio
};

const Stack = createStackNavigator<PatioStackParamList>();

export default function PatioStack() {
  const theme = useTheme();

  return (
    <Stack.Navigator
      id={undefined}
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.onPrimary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="PatioList"
        component={PatioListScreen}
        options={{
          title: t('patio.titleStack'), // "Pátios"
        }}
      />
      <Stack.Screen
        name="MotoList"
        component={MotoListScreen}
        options={({ route }) => ({
          title: t('moto.titleStack', { name: route.params.patioName }),
        })}
      />
    </Stack.Navigator>
  );
}
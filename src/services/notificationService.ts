
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Falha ao obter permissão para notificações!');
      return;
    }

    try {
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: '5cbb7ed7-45fd-4b6f-a4cc-25c43b7ae07d',
      });
      
      token = tokenData.data;
      console.log('TOKEN DE NOTIFICAÇÃO OBTIDO:', token);

    } catch (e) {
      console.error('Erro ao obter o Expo Push Token:', e);
      alert('Houve um erro ao configurar as notificações.');
    }

  } else {
    console.log('Notificações Push devem ser testadas em um dispositivo físico.');
  }
  return token;
}
import { NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type ProfileStackParamList = {
  Profile: undefined;
  AccountSettings: undefined;
};

export type RootTabParamList = {
  Home: undefined;
  'Pátio': undefined;
  Mapa: undefined;
  Devs: undefined;
  Perfil: NavigatorScreenParams<ProfileStackParamList>; 
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  Tabs: NavigatorScreenParams<RootTabParamList>; 
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AuthStackParamList {}
  }
}

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  StackScreenProps<AuthStackParamList, T>;
  
export type RootTabScreenProps<T extends keyof RootTabParamList> =
  BottomTabScreenProps<RootTabParamList, T>;
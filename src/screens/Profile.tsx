import React, { useState, useEffect, useMemo} from "react";
import {
  View,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { auth } from "../config/firebaseConfig";
import { logoutUser } from "../services/authService";
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n, { t } from "../services/i18n";
import {
  useTheme,
  Button,
  Text,
  List,
  Surface,
  Menu,
} from "react-native-paper";

interface ProfileProps {
  onLogout: () => void;
  toggleTheme: () => void;
}

const LocalDefaultAvatar = require('../../assets/generic-avatar.png'); 
const DefaultRemoteAvatar = "https://cdn-icons-png.flaticon.com/512/20/20162.png";

export default function Profile({ onLogout, toggleTheme }: ProfileProps) {
  const theme = useTheme();
  const navigation = useNavigation()

  const user = auth.currentUser;
  const [loading, setLoading] = useState(false);

  const [currentLocale, setCurrentLocale] = useState(i18n.locale);

  useFocusEffect(
    React.useCallback(() => {
      const syncLocale = async () => {
        const savedLocale = await AsyncStorage.getItem('user-locale');

        const activeLocale = savedLocale || i18n.locale;

        i18n.locale = activeLocale;

        setCurrentLocale(activeLocale);
      };
      
      syncLocale();

      return () => {}; 
    }, [])
  );

  const [avatarSource, setAvatarSource] = useState(
    user?.photoURL || DefaultRemoteAvatar
  );

  const listItems = useMemo(() => [
    { id: 'conta', icon: 'account-cog', title: t('profile.account'), description: t('profile.accountDesc') },
    { 
      id: 'tema', 
      icon: theme.dark ? "white-balance-sunny" : "weather-night", 
      title: t('profile.theme'), 
      description: t('profile.themeDesc', { theme: theme.dark ? t('themes.dark') : t('themes.light') })
    },
    { 
      id: 'idioma', 
      icon: 'translate', 
      title: t('profile.language'), 
      description: t(`languages.${currentLocale}` as 'languages.pt' | 'languages.es') 
    },
  ], [currentLocale, theme.dark]);
  
  const handleListItemPress = (id: string) => {
    switch (id) {
      case 'tema':
        toggleTheme();
        break;
      case 'conta':
        navigation.navigate('AccountSettings' as never); 
        break;
      case 'idioma':
        navigation.navigate('LanguageSettings' as never);
        break;
      default:
        Alert.alert("Ação:", `Navegar para a tela de ${id}.`);
        break;
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      onLogout();
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Não foi possível sair.");
    }
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      alignItems: 'center',
      padding: 30,
      backgroundColor: theme.colors.surface, 
    },
    avatarContainer: {
      alignItems: "center",
      marginBottom: 10,
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
      marginBottom: 8,
      borderWidth: 3,
      borderColor: theme.colors.primary,
    },
    editText: {
      color: theme.colors.primary,
    },
    nameText: {
      marginTop: 8,
      fontSize: 20,
      fontWeight: "600",
      color: theme.colors.onSurface,
    },
    listSection: {
        marginTop: 10,
        marginHorizontal: 16,
    },
    listItemCard: {
        backgroundColor: theme.colors.surfaceVariant, 
        borderRadius: 20, 
        marginBottom: 10,
        overflow: 'hidden',
    },
    listItem: {
        paddingHorizontal: 0,
    },
  });

  const imageSource = typeof avatarSource === 'string'
    ? { uri: avatarSource }
    : avatarSource;
  
  const finalImageSource = avatarSource === DefaultRemoteAvatar ? LocalDefaultAvatar : imageSource;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={{ color: theme.colors.onSurface }}>
            {t('profile.title')}
        </Text>
        
        <View style={styles.avatarContainer}>
          <Image source={finalImageSource} style={styles.avatar} />
        </View>

        <Text variant="titleLarge" style={styles.nameText}>{user?.displayName || t('profile.user')}</Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceDisabled }}>{user?.email ||t('profile.email')}</Text>
      </View>
      
      {/* Lista de Itens (Cards) */}
      <View style={styles.listSection}>
        <List.Section title={t('profile.settings')} titleStyle={{ color: theme.colors.onSurface }}>
          {listItems.map((item) => (
            <Surface key={item.id} style={styles.listItemCard} elevation={2}>
              <List.Item
                title={item.title}
                description={item.description}
                descriptionStyle={{ color: theme.colors.onSurfaceDisabled }}
                left={props => <List.Icon {...props} icon={item.icon} color={theme.colors.primary} />}
                onPress={() => handleListItemPress(item.id)}
                style={styles.listItem}
                right={props => <List.Icon {...props} icon="chevron-right" />}
              />
            </Surface>
          ))}
        </List.Section>
      </View>

      {/* Botão de Logout */}
      <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 30 }}>
        <Button
          mode="contained"
          onPress={handleLogout}
          icon="logout"
          buttonColor={theme.colors.error}
          style={{ marginBottom: 10, borderRadius: 20 }}
          disabled={loading}
        >
          {t('profile.logout')}
        </Button>
      </View>
    </ScrollView>
  );
}
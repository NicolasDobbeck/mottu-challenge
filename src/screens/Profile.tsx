import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { auth } from "../config/firebaseConfig";
import { logoutUser } from "../services/authService";
import { useTheme, Button, Text, List, Surface } from "react-native-paper";
import { useNavigation } from "@react-navigation/native"; 

interface ProfileProps {
  onLogout: () => void;
  toggleTheme: () => void;
}

const LocalDefaultAvatar = require('../../assets/generic-avatar.png'); 
const DefaultRemoteAvatar = "https://cdn-icons-png.flaticon.com/512/20/20162.png";

export default function Profile({ onLogout, toggleTheme }: ProfileProps) {
  const theme = useTheme();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const [avatarSource, setAvatarSource] = useState<string | ImageSourcePropType>(DefaultRemoteAvatar);

  const user = auth.currentUser;
  
  const listItems = [
    { id: 'conta', icon: 'account-cog', title: 'Conta', description: 'Altere seus dados pessoais e senha.' },
    { id: 'tema', icon: theme.dark ? "white-balance-sunny" : "weather-night", title: 'Tema', description: `Modo atual: ${theme.dark ? 'Escuro' : 'Claro'}` },
    { id: 'idioma', icon: 'translate', title: 'Idioma', description: 'Selecione o idioma do aplicativo.' },
  ];

  const handleLogout = async () => {
    try {
      await logoutUser();
      onLogout();
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Não foi possível sair.");
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão negada", "É necessário permitir o acesso à galeria.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatarSource(result.assets[0].uri);
    }
  };

  const handleListItemPress = (id: string) => {
    switch (id) {
      case 'tema':
        toggleTheme();
        break;
      case 'conta':
        Alert.alert("Ação: Conta", "Navegar para a tela de Configurações da Conta.");
        break;
      default:
        Alert.alert("Ação:", `Navegar para a tela de ${id}.`);
        break;
    }
  };
  
  // Criação dinâmica dos estilos usando o tema
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
    // Estilo de Card
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
            Perfil
        </Text>

        <TouchableOpacity onPress={pickImage} style={styles.avatarContainer} disabled={loading}>
          <Image source={finalImageSource} style={styles.avatar} />
          <Text variant="bodyMedium" style={styles.editText}>Trocar Foto</Text>
        </TouchableOpacity>

        <Text variant="titleLarge" style={styles.nameText}>{user?.displayName || "Usuário Mottu"}</Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceDisabled }}>{user?.email || "email@mottu.com"}</Text>
      </View>
      
      {/* Lista de Itens (Cards) */}
      <View style={styles.listSection}>
        <List.Section title="Configurações" titleStyle={{ color: theme.colors.onSurface }}>
            {listItems.map((item, index) => (
                <Surface key={index} style={styles.listItemCard} elevation={2}>
                    <List.Item
                        title={item.title}
                        description={item.description}
                        descriptionStyle={{ color: theme.colors.onSurfaceDisabled }}
                        left={props => <List.Icon {...props} icon={item.icon} color={theme.colors.primary} />}
                        onPress={() => handleListItemPress(item.id)}
                        style={styles.listItem}
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
          Logout
        </Button>
      </View>
    </ScrollView>
  );
}
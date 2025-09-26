import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../config/firebaseConfig";
import { logoutUser } from "../services/authService";
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
  const [idiomaMenuVisible, setIdiomaMenuVisible] = useState(false);

  // Estado do Avatar: Tentativa de usar a foto atual do Firebase ou a remota padrão
  const [avatarSource, setAvatarSource] = useState(
    user?.photoURL || DefaultRemoteAvatar
  );

  // 1.Lista de itens de menu refatorada para navegação
  const listItems = [
    { id: 'conta', icon: 'account-cog', title: 'Conta', description: 'Altere seus dados pessoais e senha.' },
    { id: 'tema', icon: theme.dark ? "white-balance-sunny" : "weather-night", title: 'Tema', description: `Modo atual: ${theme.dark ? 'Escuro' : 'Claro'}` },
    { id: 'idioma', icon: 'translate', title: 'Idioma', description: 'Português (Brasil)' },
  ];
  
  const handleListItemPress = (id: string) => {
    switch (id) {
      case 'tema':
        toggleTheme();
        break;
      case 'conta':
        navigation.navigate('AccountSettings' as never); 
        break;
      case 'idioma':
        setIdiomaMenuVisible(true);
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
            Perfil
        </Text>
        
        <View style={styles.avatarContainer}>
          <Image source={finalImageSource} style={styles.avatar} />
        </View>

        <Text variant="titleLarge" style={styles.nameText}>{user?.displayName || "Usuário Mottu"}</Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceDisabled }}>{user?.email || "email@mottu.com"}</Text>
      </View>
      
      {/* Lista de Itens (Cards) */}
      <View style={styles.listSection}>
        <List.Section title="Configurações" titleStyle={{ color: theme.colors.onSurface }}>
            {listItems.map((item, index) => (
                item.id === 'idioma' ? (
                    <Menu
                        key={item.id}
                        visible={idiomaMenuVisible}
                        onDismiss={() => setIdiomaMenuVisible(false)}
                        anchor={
                            <Surface style={styles.listItemCard} elevation={2}>
                                <List.Item
                                    title={item.title}
                                    description={item.description}
                                    descriptionStyle={{ color: theme.colors.onSurfaceDisabled }}
                                    left={props => <List.Icon {...props} icon={item.icon} color={theme.colors.primary} />}
                                    onPress={() => handleListItemPress(item.id)}
                                    style={styles.listItem}
                                />
                            </Surface>
                        }
                    >
                        {/* Itens do Dropdown de Idioma */}
                        <Menu.Item onPress={() => { Alert.alert("Idioma", "Português selecionado"); setIdiomaMenuVisible(false); }} title="Português (BR)" />
                        <Menu.Item onPress={() => { Alert.alert("Idioma", "Espanhol selecionado"); setIdiomaMenuVisible(false); }} title="Español" />
                        <Menu.Item onPress={() => { Alert.alert("Idioma", "Inglês selecionado"); setIdiomaMenuVisible(false); }} title="English" />
                    </Menu>
                ) : (
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
                )
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
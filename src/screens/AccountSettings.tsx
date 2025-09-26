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
import { changeUserPassword, updateUserProfile } from "../services/authService"; 
import { useTheme, Button, Text, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const LocalDefaultAvatar = require('../../assets/generic-avatar.png'); 
const DefaultRemoteAvatar = "https://cdn-icons-png.flaticon.com/512/20/20162.png";

export default function AccountSettings() {
  const theme = useTheme();
  const navigation = useNavigation();

  const user = auth.currentUser;
  
  const [nomeSocial, setNomeSocial] = useState(user?.displayName || "");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const [avatarSource, setAvatarSource] = useState<string | ImageSourcePropType>(
    user?.photoURL || DefaultRemoteAvatar
  );

  const handleUpdateProfile = async () => {
    if (!user) {
      Alert.alert("Erro", "Nenhum usuário autenticado. Faça login novamente.");
      return;
    }

    try {
      setLoading(true);
      let changesMade = false;

      if (nomeSocial.trim() !== (user.displayName || "")) {
        await updateUserProfile(user, { displayName: nomeSocial.trim() });
        changesMade = true;
      }

      // 2. Atualizar Senha
      if (senha.trim().length > 0) {
        if (senha.trim().length < 6) {
             Alert.alert("Atenção", "A senha deve ter pelo menos 6 caracteres.");
             return; // Sai da função para não salvar
        }
        await changeUserPassword(user, senha.trim());
        setSenha("");
        changesMade = true;
      }

      const isNewPhoto = typeof avatarSource === 'string' && avatarSource !== (user.photoURL || DefaultRemoteAvatar);
      
      if (isNewPhoto && avatarSource !== DefaultRemoteAvatar) {
         Alert.alert("Atenção", "A função de upload de imagem para o Firebase Storage ainda não foi implementada. A imagem local será salva ao carregar a tela, mas não persistirá no banco de dados.");
         await updateUserProfile(user, { photoURL: avatarSource });
         changesMade = true;
      }


      if (changesMade) {
        Alert.alert("Sucesso", "Suas informações foram atualizadas!");
        navigation.goBack(); 
      } else {
        Alert.alert("Atenção", "Nenhuma alteração detectada.");
      }
      
    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro ao Salvar", error.message || "Não foi possível atualizar. Tente fazer login novamente.");
    } finally {
      setLoading(false);
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
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatarSource(result.assets[0].uri);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    section: {
        padding: 20,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 20,
        backgroundColor: theme.colors.surface,
        marginBottom: 20,
    },
    title: {
      color: theme.colors.onSurface,
      marginBottom: 10,
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
    input: {
      marginBottom: 15,
      backgroundColor: theme.colors.surface,
    },
    saveButton: {
        marginTop: 20,
        borderRadius: 8,
    }
  });

  // Lógica para renderizar a imagem correta (Local vs URI)
  const imageSource = typeof avatarSource === 'string'
    ? { uri: avatarSource }
    : avatarSource;
  
  const finalImageSource = avatarSource === DefaultRemoteAvatar ? LocalDefaultAvatar : imageSource;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
            Configurações da Conta
        </Text>
        <TouchableOpacity onPress={pickImage} style={styles.avatarContainer} disabled={loading}>
          <Image source={finalImageSource} style={styles.avatar} />
          <Text variant="bodyMedium" style={styles.editText}>Trocar Foto</Text>
        </TouchableOpacity>

        <Text variant="titleLarge" style={styles.title}>{user?.displayName || "Nome Social"}</Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceDisabled }}>{user?.email || "email@mottu.com"}</Text>
      </View>


      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.title}>
            Informações Pessoais
        </Text>
        <TextInput
          label="Nome Social / Nickname"
          mode="outlined"
          style={styles.input}
          value={nomeSocial}
          onChangeText={setNomeSocial}
          disabled={loading}
        />

        <Text variant="titleMedium" style={styles.title}>
            Atualizar Senha
        </Text>
        <TextInput
          label="Nova Senha (Mínimo 6 caracteres)"
          mode="outlined"
          secureTextEntry
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          disabled={loading}
        />

        <Button
          mode="contained"
          onPress={handleUpdateProfile}
          disabled={loading}
          loading={loading}
          style={styles.saveButton}
        >
          Salvar Alterações
        </Button>
      </View>
    </ScrollView>
  );
}
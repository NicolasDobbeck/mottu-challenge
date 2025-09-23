// src/screens/Profile.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { auth } from "../config/firebaseConfig";
import { logoutUser, changeUserPassword } from "../services/authService";

interface ProfileProps {
  onLogout: () => void;
}

export default function Profile({ onLogout }: ProfileProps) {
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatarUri, setAvatarUri] = useState(
    "https://cdn-icons-png.flaticon.com/512/20/20162.png"
  );

  const user = auth.currentUser;

  const handleUpdatePassword = async () => {
    if (!user) {
      Alert.alert("Erro", "Nenhum usuário autenticado.");
      return;
    }

    try {
      setLoading(true);
      await changeUserPassword(user, senha);
      Alert.alert("Sucesso", "Senha alterada com sucesso!");
      setSenha("");
      // Navegação para a Home, se desejar
      // navigation.navigate("Home"); 
    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro", error.message || "Não foi possível alterar a senha.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      onLogout(); // Chama a função para atualizar o estado no App.tsx
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Não foi possível sair.");
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão negada",
        "É necessário permitir o acesso à galeria para alterar a imagem de perfil."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>

      <TouchableOpacity onPress={pickImage} style={styles.avatarContainer} disabled={loading}>
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
        <Text style={styles.editText}>Trocar Foto</Text>
      </TouchableOpacity>

      {user?.displayName && (
        <Text style={styles.nameText}>{user.displayName}</Text>
      )}

      <TextInput
        placeholder="Digite sua nova senha"
        placeholderTextColor="#999"
        secureTextEntry
        style={styles.input}
        value={senha}
        onChangeText={setSenha}
        editable={!loading}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.disabledButton]}
        onPress={handleUpdatePassword}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Salvar Alterações</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={handleLogout}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
    fontWeight: "bold",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 5,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  editText: {
    fontSize: 14,
    color: "#05AF31",
  },
  nameText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 18,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#05AF31",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "#890e08",
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: "#ccc",
    opacity: 0.7,
  },
});
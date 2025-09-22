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
import { useNavigation } from "@react-navigation/native";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ProfileProps {
  onLogout: () => void;
}

export default function Profile({ onLogout }: ProfileProps) {
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();

  const [senha, setSenha] = useState("");
  const [avatarUri, setAvatarUri] = useState(
    "https://cdn-icons-png.flaticon.com/512/20/20162.png"
  );

  const savePasswordMutation = useMutation({
    mutationFn: async (newPassword: string) => {
      if (!newPassword.trim()) throw new Error('Senha não pode estar vazia');
      await AsyncStorage.setItem("userPassword", newPassword);
    },
    onSuccess: () => {
      Alert.alert("Sucesso", "Alterações salvas");
      queryClient.invalidateQueries({ queryKey: ['userPassword'] }); // Invalida cache se houver query para senha
      navigation.navigate("Home");
    },
    onError: (error: any) => {
      Alert.alert("Erro", `Não foi possível salvar as alterações: ${error.message}`);
    },
  });

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

      <TouchableOpacity onPress={pickImage} style={styles.avatarContainer} disabled={savePasswordMutation.isPending}>
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
        <Text style={styles.editText}>Trocar Foto</Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Digite sua nova senha"
        placeholderTextColor="#999"
        secureTextEntry
        style={styles.input}
        value={senha}
        onChangeText={setSenha}
        editable={!savePasswordMutation.isPending}
      />

      <TouchableOpacity
        style={[
          styles.button,
          savePasswordMutation.isPending && styles.disabledButton
        ]}
        onPress={() => savePasswordMutation.mutate(senha)}
        disabled={savePasswordMutation.isPending}
      >
        {savePasswordMutation.isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Salvar Alterações</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={onLogout} disabled={savePasswordMutation.isPending}>
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
    marginBottom: 20,
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
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
});
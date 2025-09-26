import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { registerUser } from "../services/authService";
import { CommonActions } from '@react-navigation/native';
import { useTheme, Text, Button } from 'react-native-paper'; 

export default function Register({ navigation }: any) {
  const theme = useTheme();
  const [nomeSocial, setNomeSocial] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nomeSocial || !email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    try {
      setLoading(true);
      await registerUser(email, senha, nomeSocial);
      Alert.alert("Sucesso", "Conta criada com sucesso! Faça login para continuar.");
      
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro", error.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  // 👈 Estilos dinâmicos
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
      padding: 20,
    },
    logo: { width: 120, height: 120, marginBottom: 20, resizeMode: "contain" },
    title: { 
        fontSize: 22, 
        fontWeight: "bold", 
        marginBottom: 20, 
        color: theme.colors.onBackground
    },
    input: {
      width: "100%",
      height: 50,
      borderColor: theme.colors.outline,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 15,
      marginBottom: 15,
      backgroundColor: theme.colors.surface,
      color: theme.colors.onSurface,
    },
    button: {
      width: "100%",
      height: 50,
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 15,
    },
    buttonText: { color: theme.colors.onPrimary, fontSize: 16, fontWeight: "bold" },
    linkText: { color: theme.colors.primary, fontSize: 14 },
  });

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/logo-mottu.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>Criar Conta</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome Social"
        placeholderTextColor={theme.colors.onSurfaceDisabled}
        value={nomeSocial}
        onChangeText={setNomeSocial}
      />

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor={theme.colors.onSurfaceDisabled}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor={theme.colors.onSurfaceDisabled}
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.onPrimary} />
        ) : (
          <Text style={styles.buttonText}>Registrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.linkText}>Já tem conta? Faça login</Text>
      </TouchableOpacity>
    </View>
  );
}
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useMutation } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginProps> = ({ onLogin }) => {
  const [nomeSocial, setNomeSocial] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nomeError, setNomeError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [senhaError, setSenhaError] = useState('');

  const loginMutation = useMutation({
    mutationFn: async ({ userEmail, userNome }: { userEmail: string; userNome: string }) => {
      if (!userEmail.trim() || !userNome.trim()) {
        throw new Error('Email e nome social são obrigatórios');
      }
      await AsyncStorage.setItem('userEmail', userEmail);
      await AsyncStorage.setItem('userNomeSocial', userNome);
    },
    onSuccess: () => {
      onLogin();
    },
    onError: (error: any) => {
      console.error('Erro ao salvar os dados:', error);
      Alert.alert('Erro', 'Falha ao processar login. Tente novamente.');
    },
  });

  const handleLogin = () => {
    let hasError = false;
    setNomeError('');
    setEmailError('');
    setSenhaError('');

    if (!nomeSocial.trim()) {
      setNomeError('O campo nome social é obrigatório.');
      hasError = true;
    }

    if (!email.trim()) {
      setEmailError('O campo email é obrigatório.');
      hasError = true;
    }

    if (!senha.trim()) {
      setSenhaError('O campo senha é obrigatório.');
      hasError = true;
    }

    if (!hasError && !loginMutation.isPending) {
      loginMutation.mutate({ userEmail: email, userNome: nomeSocial });
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo-mottu.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Bem-vindo</Text>

      <TextInput
        style={[styles.input, nomeError && styles.inputError]}
        placeholder="Nome Social"
        placeholderTextColor="#999"
        value={nomeSocial}
        onChangeText={setNomeSocial}
        editable={!loginMutation.isPending}
      />
      {nomeError ? <Text style={styles.errorText}>{nomeError}</Text> : null}

      <TextInput
        style={[styles.input, emailError && styles.inputError]}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!loginMutation.isPending}
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <TextInput
        style={[styles.input, senhaError && styles.inputError]}
        placeholder="Senha"
        placeholderTextColor="#999"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
        editable={!loginMutation.isPending}
      />
      {senhaError ? <Text style={styles.errorText}>{senhaError}</Text> : null}

      <TouchableOpacity 
        style={[
          styles.button, 
          loginMutation.isPending && styles.disabledButton
        ]} 
        onPress={handleLogin}
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    marginBottom: 40,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 18,
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginTop: -5,
  },
  button: {
    backgroundColor: '#05AF31',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
});
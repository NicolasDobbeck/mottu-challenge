// src/screens/Login.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native';
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

  const handleLogin = async () => {
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

    if (!hasError) {
      try {
        await AsyncStorage.setItem('userEmail', email);
        await AsyncStorage.setItem('userNomeSocial', nomeSocial);
        onLogin();  // só chama a função passada, sem usar navegação aqui
      } catch (error) {
        console.error('Erro ao salvar os dados:', error);
      }
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
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <TextInput
        style={[styles.input, senhaError && styles.inputError]}
        placeholder="Senha"
        placeholderTextColor="#999"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      {senhaError ? <Text style={styles.errorText}>{senhaError}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
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
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
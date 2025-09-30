import React, { useState } from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { useTheme, Text, Button, TextInput, HelperText } from 'react-native-paper';
import { registerUser } from '../services/authService';

export default function RegisterScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  const [nomeSocial, setNomeSocial] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ nomeSocial?: string; email?: string; senha?: string }>({});

  const validate = () => {
    const newErrors: { nomeSocial?: string; email?: string; senha?: string } = {};
    if (!nomeSocial) {
      newErrors.nomeSocial = 'O nome social é obrigatório.';
    }
    if (!email) {
      newErrors.email = 'O e-mail é obrigatório.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Formato de e-mail inválido.';
    }
    if (!senha) {
      newErrors.senha = 'A senha é obrigatória.';
    } else if (senha.length < 6) {
      newErrors.senha = 'A senha deve ter no mínimo 6 caracteres.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFirebaseError = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Este e-mail já está a ser utilizado.';
      case 'auth/invalid-email':
        return 'O formato do e-mail é inválido.';
      case 'auth/weak-password':
        return 'A senha é muito fraca. Tente uma mais forte.';
      default:
        return 'Ocorreu um erro ao criar a conta.';
    }
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await registerUser(email, senha, nomeSocial);
      Alert.alert('Sucesso', 'Conta criada com sucesso! Faça login para continuar.');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
    } catch (error: any) {
      const message = handleFirebaseError(error.code);
      setErrors({ email: message });
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: theme.colors.background,
    },
    logo: {
      width: 120,
      height: 120,
      alignSelf: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: theme.colors.onBackground,
    },
    input: {
      marginBottom: 5,
    },
    button: {
      marginTop: 20,
      paddingVertical: 8,
    },
    linkContainer: {
      marginTop: 20,
      alignItems: 'center',
    },
    link: {
      color: theme.colors.primary,
    },
    helperText: {
      marginBottom: 10,
    }
  });

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo-mottu.png')} style={styles.logo} />
      <Text style={styles.title}>Criar Conta</Text>

      <TextInput
        label="Nome Social"
        value={nomeSocial}
        onChangeText={(text) => {
          setNomeSocial(text);
          if (errors.nomeSocial) setErrors({});
        }}
        style={styles.input}
        error={!!errors.nomeSocial}
      />
      <HelperText type="error" visible={!!errors.nomeSocial} style={styles.helperText}>
        {errors.nomeSocial}
      </HelperText>

      <TextInput
        label="E-mail"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (errors.email) setErrors({});
        }}
        style={styles.input}
        error={!!errors.email}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <HelperText type="error" visible={!!errors.email} style={styles.helperText}>
        {errors.email}
      </HelperText>

      <TextInput
        label="Senha"
        value={senha}
        onChangeText={(text) => {
          setSenha(text);
          if (errors.senha) setErrors({});
        }}
        secureTextEntry={isPasswordSecure}
        style={styles.input}
        error={!!errors.senha}
        right={
          <TextInput.Icon
            icon={isPasswordSecure ? 'eye' : 'eye-off'}
            onPress={() => setIsPasswordSecure(!isPasswordSecure)}
          />
        }
      />
      <HelperText type="error" visible={!!errors.senha} style={styles.helperText}>
        {errors.senha}
      </HelperText>

      <Button
        mode="contained"
        onPress={handleRegister}
        loading={loading}
        disabled={loading}
        style={styles.button}
        labelStyle={{ fontWeight: 'bold' }}
      >
        {loading ? 'A registar...' : 'Registar'}
      </Button>

      <View style={styles.linkContainer}>
        <Text onPress={() => navigation.navigate('Login' as never)}>
          <Text style={styles.link}>Já tem conta? Faça login</Text>
        </Text>
      </View>
    </View>
  );
}
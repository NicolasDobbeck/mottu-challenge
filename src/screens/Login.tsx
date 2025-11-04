import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme, Text, Button, TextInput, HelperText } from 'react-native-paper';
import { loginUser } from '../services/authService';
import { t } from '../services/i18n';

interface LoginProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginProps> = ({ onLogin }) => {
  const theme = useTheme();
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isPasswordSecure, setIsPasswordSecure] = useState(true); // Estado para a visibilidade da senha
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; senha?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; senha?: string } = {};
    if (!email) {
      newErrors.email = t('auth.errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('auth.errors.emailInvalid');
    }
    if (!senha) {
      newErrors.senha = t('auth.errors.passwordRequired');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFirebaseError = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return t('auth.errors.credentialsInvalid');
      case 'auth/invalid-email':
        return t('auth.errors.emailInvalid');
      default:
        return t('auth.errors.loginError');
    }
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await loginUser(email, senha);
      onLogin();
    } catch (error: any) {
      const message = handleFirebaseError(error.code);
      setErrors({ email: message, senha: ' ' }); // Exibe o erro no campo de e-mail e marca o de senha
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
      <Text style={styles.title}>{t('auth.loginTitle')}</Text>

      <TextInput
        label={t('auth.emailLabel')}
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
        label={t('auth.passwordLabel')}
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
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
        style={styles.button}
        labelStyle={{ fontWeight: 'bold' }}
      >
        {loading ? t('auth.loading') : t('auth.loginButton')}
      </Button>

      <View style={styles.linkContainer}>
        <Text onPress={() => navigation.navigate('Register' as never)}>
          <Text style={styles.link}>{t('auth.goToRegister')}</Text>
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;
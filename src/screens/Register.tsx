import React, { useState } from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { useTheme, Text, Button, TextInput, HelperText } from 'react-native-paper';
import { registerUser } from '../services/authService';
import { t } from '../services/i18n';

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
      newErrors.nomeSocial = t('auth.errors.nameRequired');
    }
    if (!email) {
      newErrors.email = t('auth.errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('auth.errors.emailInvalid');
    }
    if (!senha) {
      newErrors.senha = t('auth.errors.passwordRequired');
    } else if (senha.length < 6) {
      newErrors.senha = t('auth.errors.passwordLength');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFirebaseError = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return t('auth.errors.emailInUse');
      case 'auth/invalid-email':
        return t('auth.errors.emailInvalid');
      case 'auth/weak-password':
        return t('auth.errors.passwordWeak')
      default:
        return t('auth.errors.registerError');
    }
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await registerUser(email, senha, nomeSocial);
      Alert.alert(t('auth.registerSuccessTitle'), t('auth.registerSuccessMsg'));
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
      <Text style={styles.title}>{t('auth.registerTitle')}</Text>

      <TextInput
        label={t('auth.nameLabel')}
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
        onPress={handleRegister}
        loading={loading}
        disabled={loading}
        style={styles.button}
        labelStyle={{ fontWeight: 'bold' }}
      >
        {loading ? t('auth.registering') : t('auth.registerButton')}
      </Button>

      <View style={styles.linkContainer}>
        <Text onPress={() => navigation.navigate('Login' as never)}>
          <Text style={styles.link}>{t('auth.goToLogin')}</Text>
        </Text>
      </View>
    </View>
  );
}
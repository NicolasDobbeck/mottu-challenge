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
import { t } from '../services/i18n';

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
      Alert.alert(t('common.error'), t('accountSettings.errorAuth'));
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
             Alert.alert(t('common.attention'), t('accountSettings.warnPassword'));
             return; // Sai da função para não salvar
        }
        await changeUserPassword(user, senha.trim());
        setSenha("");
        changesMade = true;
      }

      const isNewPhoto = typeof avatarSource === 'string' && avatarSource !== (user.photoURL || DefaultRemoteAvatar);
      
      if (isNewPhoto && avatarSource !== DefaultRemoteAvatar) {
         Alert.alert(t('common.attention'), t('accountSettings.warnImageUpload'));
         await updateUserProfile(user, { photoURL: avatarSource });
         changesMade = true;
      }


      if (changesMade) {
        Alert.alert(t('accountSettings.success'), t('accountSettings.successMsg'));
        navigation.goBack(); 
      } else {
        Alert.alert(t('accountSettings.noChanges'), t('accountSettings.noChangesMsg'));
      }
      
    } catch (error: any) {
      console.error(error);
      Alert.alert(t('accountSettings.errorSave'), error.message || t('accountSettings.errorSaveMsg'));
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(t('accountSettings.warnPermission'), t('accountSettings.warnPermissionMsg'));
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
            {t('accountSettings.title')}
        </Text>
        <TouchableOpacity onPress={pickImage} style={styles.avatarContainer} disabled={loading}>
          <Image source={finalImageSource} style={styles.avatar} />
          <Text variant="bodyMedium" style={styles.editText}>{t('accountSettings.changePhoto')}</Text>
        </TouchableOpacity>

        <Text variant="titleLarge" style={styles.title}>{user?.displayName || "Nome Social"}</Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceDisabled }}>{user?.email || "email@mottu.com"}</Text>
      </View>


      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.title}>
            {t('accountSettings.info')}
        </Text>
        <TextInput
          label={t('accountSettings.nameLabel')}
          mode="outlined"
          style={styles.input}
          value={nomeSocial}
          onChangeText={setNomeSocial}
          disabled={loading}
        />

        <Text variant="titleMedium" style={styles.title}>
            {t('accountSettings.password')}
        </Text>
        <TextInput
          label={t('accountSettings.passwordLabel')}
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
          {t('accountSettings.save')}
        </Button>
      </View>
    </ScrollView>
  );
}
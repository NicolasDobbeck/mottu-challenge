import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { List, useTheme } from 'react-native-paper';
import i18n, { t } from '../services/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LanguageSettings() {
  const theme = useTheme();

  const [currentLocale, setCurrentLocale] = useState(i18n.locale);

  const handleChangeLanguage = async (locale: 'pt' | 'es') => {
    i18n.locale = locale; 
    await AsyncStorage.setItem('user-locale', locale);
    setCurrentLocale(locale);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <List.Section>
        {/* Item Português */}
        <List.Item
          title={t('languages.pt')}
          onPress={() => handleChangeLanguage('pt')}
          right={props => (
            currentLocale === 'pt' ? <List.Icon {...props} icon="check" /> : null
          )}
        />
        
        {/* Item Espanhol */}
        <List.Item
          title={t('languages.es')}
          onPress={() => handleChangeLanguage('es')}
          right={props => (
            currentLocale === 'es' ? <List.Icon {...props} icon="check" /> : null
          )}
        />
      </List.Section>
    </ScrollView>
  );
}
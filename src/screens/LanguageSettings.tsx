import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { List, useTheme } from 'react-native-paper';
import i18n, { t } from '../services/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LanguageSettings() {
  const theme = useTheme();
  
  // Estado local para mostrar o "check" no item selecionado
  const [currentLocale, setCurrentLocale] = useState(i18n.locale);

  // Função que muda o idioma, salva e atualiza o "check"
  const handleChangeLanguage = async (locale: 'pt' | 'es') => {
    i18n.locale = locale; // Muda o idioma globalmente
    await AsyncStorage.setItem('user-locale', locale); // Salva a preferência
    setCurrentLocale(locale); // Atualiza o "check" nesta tela
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <List.Section>
        {/* Item Português */}
        <List.Item
          title={t('languages.pt')}
          onPress={() => handleChangeLanguage('pt')}
          right={props => (
            // Mostra o "check" se o idioma atual for 'pt'
            currentLocale === 'pt' ? <List.Icon {...props} icon="check" /> : null
          )}
        />
        
        {/* Item Espanhol */}
        <List.Item
          title={t('languages.es')}
          onPress={() => handleChangeLanguage('es')}
          right={props => (
            // Mostra o "check" se o idioma atual for 'es'
            currentLocale === 'es' ? <List.Icon {...props} icon="check" /> : null
          )}
        />
      </List.Section>
    </ScrollView>
  );
}
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme, Text, Card, List } from 'react-native-paper';
import Constants from 'expo-constants'; // Importa a biblioteca que instalamos
import { t } from '../services/i18n';

const appVersion = Constants.expoConfig?.version || '1.0.0';
const commitHash = (Constants as any).expoConfig?.revisionId || 'N/A (Somente em build)';

export default function AboutScreen() {
  const theme = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Card.Title 
          title="MottuFlux" 
          subtitle={t('about.subtitle')} 
          left={(props) => <List.Icon {...props} icon="bike-fast" color={theme.colors.primary} />} 
        />
        <Card.Content>
          <Text variant="bodyLarge" style={styles.text}>{t('about.description')}</Text>
          
          <List.Section style={{ marginTop: 20 }}>
            <List.Subheader>{t('about.buildInfo')}</List.Subheader>
            <List.Item
              title={t('about.version')}
              description={appVersion}
              left={(props) => <List.Icon {...props} icon="information-outline" />}
            />
            <List.Item
              title={t('about.commitHash')}
              description={commitHash}
              descriptionNumberOfLines={1}
              left={(props) => <List.Icon {...props} icon="git" />}
            />
          </List.Section>
          
           <List.Section>
             <List.Subheader>{t('about.developers')}</List.Subheader>
             <List.Item
              title="Nicolas Dobbeck"
              left={(props) => <List.Icon {...props} icon="github" />}
            />
             <List.Item
              title="José Bezerra"
              left={(props) => <List.Icon {...props} icon="github" />}
            />
             <List.Item
              title="Thiago Henry"
              left={(props) => <List.Icon {...props} icon="github" />}
            />
           </List.Section>

        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: 'transparent',
    elevation: 0,
  },
  text: {
    lineHeight: 22,
  },
});
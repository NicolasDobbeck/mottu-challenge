import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import DevCard from '../components/DevCard';
import { useTheme } from 'react-native-paper'; 

export default function Developers() {
  const theme = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      padding: 20,
      alignItems: "center",
      backgroundColor: theme.colors.background,
      paddingTop: 80,
    },
  });
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <DevCard
        name="Nicolas Dobbeck"
        image={require('../../assets/nicolas.jpg')}
        github="https://github.com/NicolasDobbeck"
      />
      <DevCard
        name="José Bezerra"
        image={require('../../assets/jose.jpg')}
        github="https://github.com/jjosebastos"
      />
      <DevCard
        name="Thiago Henry"
        image={require('../../assets/thiago.png')}
        github="https://github.com/lavithiluan"
      />
    </ScrollView>
  );
}
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import DevCard from '../components/DevCard';

export default function Developers() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <DevCard
        name="Nicolas Dobbeck"
        image={require('../assets/nicolas.jpg')}
        github="https://github.com/NicolasDobbeck"
      />
      <DevCard
        name="José Bezerra"
        image={require('../assets/jose.jpg')}
        github="https://github.com/jjosebastos"
      />
      <DevCard
        name="Thiago Henry"
        image={require('../assets/thiago.png')}
        github="https://github.com/lavithiluan"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    paddingTop: 80,
  },
});

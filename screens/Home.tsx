import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
  const navigation = useNavigation();
  const [nomeSocial, setNomeSocial] = useState<string | null>(null);

  useEffect(() => {
    const loadNomeSocial = async () => {
      const nome = await AsyncStorage.getItem('userNomeSocial');
      setNomeSocial(nome);
    };

    loadNomeSocial();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.title}>MottuFlux</Text>
        <Text style={styles.subtitle}>
          {nomeSocial ? `Bem-vindo, ${nomeSocial}!` : 'Bem-vindo ao App de Pátio da Mottu!'}{'\n'}
          Com ele, você garante o registro, rastreio e monitoramento das motos da Mottu de forma rápida e segura.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Pátio' as never)}
      >
        <Text style={styles.buttonText}>Visualizar pátio digital</Text>
      </TouchableOpacity>

      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/background.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  topContainer: {
    alignItems: 'center',
    marginTop: 90,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#05AF31',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    lineHeight: 22,
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 100,
  },
  image: {
    width: '100%',
    height: 200,
  },
  button: {
    backgroundColor: '#05AF31',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
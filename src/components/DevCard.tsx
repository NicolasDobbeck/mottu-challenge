import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { useTheme, Text, Surface } from 'react-native-paper'; 

interface Props {
  name: string;
  image: any;
  github: string;
}

export default function DevCard({ name, image, github }: Props) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    card: {
      width: "90%",
      borderRadius: theme.roundness * 3,
      padding: 16,
      marginBottom: 20,
      alignItems: "center",
    },
    image: {
      width: 120,
      height: 120,
      borderRadius: 60,
      marginBottom: 12,
    },
    name: {
      fontSize: 18,
      fontWeight: "500",
    },
  });

  return (
    <Surface style={styles.card} elevation={3}> 
      <TouchableOpacity onPress={() => Linking.openURL(github)} style={{ alignItems: 'center' }}>
        <Image source={image} style={styles.image} />
        {/* 5. Usar Text do Paper */}
        <Text variant="titleMedium" style={styles.name}>{name}</Text>
      </TouchableOpacity>
    </Surface>
  );
}

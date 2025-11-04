import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, Text } from "react-native-paper";

export default function Home() {
  const navigation = useNavigation();
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
    },
    topContainer: {
      alignItems: "center",
      marginTop: 90,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: theme.colors.primary,
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.onBackground,
      textAlign: "center",
      lineHeight: 22,
    },
    imageContainer: {
      width: "100%",
      alignItems: "center",
      marginBottom: 100,
    },
    image: {
      width: "100%",
      height: 200,
    },
    button: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      marginTop: 20,
    },
    buttonText: {
      color: theme.colors.onPrimary,
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.title}>MottuFlux</Text>

        <Text style={styles.subtitle}>
          Bem-vindo ao App de Pátio da Mottu!{"\n"}
          Com ele, você garante o registro, rastreio e monitoramento das motos
          da Mottu de forma rápida e segura.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Pátio" as never)}
      >
        <Text style={styles.buttonText}>Visualizar pátio digital</Text>
      </TouchableOpacity>

      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/background.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
}
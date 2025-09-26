import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { useTheme, Text } from 'react-native-paper'; 

const STATUS_COLORS: Record<string, string> = {
  livre: "#05AF31",
  problema: "#FF3B30",
  manutencao: "#FFD60A",
};

const statusOptions = ["livre", "problema", "manutencao"];
const setores = ["Setor A", "Setor B", "Setor C", "Setor D"];

export default function PatioMapping() {
  const theme = useTheme();
  const [motos, setMotos] = useState(
    Array.from({ length: 100 }, (_, index) => {
      const status =
        statusOptions[Math.floor(Math.random() * statusOptions.length)];
      return {
        id: index + 1,
        status,
        setor: setores[Math.floor(index / 25)],
      };
    })
  );

  const [selectedMoto, setSelectedMoto] = useState<any>(null);

  const handleStatusChange = (newStatus: string) => {
    setMotos((prevMotos) =>
      prevMotos.map((moto) =>
        moto.id === selectedMoto.id ? { ...moto, status: newStatus } : moto
      )
    );
    setSelectedMoto(null);
  };

  // 👈 Estilos dinâmicos
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 25,
      paddingTop: 60,
      backgroundColor: theme.colors.background,
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      fontWeight: "bold",
      textAlign: "center",
      color: theme.colors.onBackground,
    },
    sector: {
      marginBottom: 30,
    },
    sectorTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
      color: theme.colors.onSurface,
    },
    patio: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      justifyContent: "center",
    },
    bikeSpot: {
      width: 80,
      height: 80,
      margin: 5,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    bikeText: {
      color: "#fff",
      fontWeight: "bold",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.6)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      padding: 25,
      borderRadius: 10,
      width: "85%",
      elevation: 10,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
      textAlign: "center",
      color: theme.colors.onSurface,
    },
    modalText: {
      fontSize: 16,
      marginBottom: 5,
      color: theme.colors.onSurface,
    },
    statusButtonsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: 10,
      marginTop: 10,
    },
    statusButton: {
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 8,
      flex: 1,
      alignItems: "center",
      minWidth: "30%",
    },
    statusButtonText: {
      color: "#fff",
      fontWeight: "bold",
      textTransform: "capitalize",
    },
    cancelButton: {
      marginTop: 20,
      padding: 12,
      backgroundColor: theme.colors.backdrop,
      borderRadius: 8,
      alignItems: "center",
    },
    cancelButtonText: {
      fontWeight: "bold",
      color: theme.colors.onBackground,
    },
  });


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Mapeamento do Pátio</Text>

      {setores.map((setor) => (
        <View key={setor} style={styles.sector}>
          <Text style={styles.sectorTitle}>{setor}</Text>
          <View style={styles.patio}>
            {motos
              .filter((m) => m.setor === setor)
              .map((moto) => (
                <TouchableOpacity
                  key={moto.id}
                  style={[
                    styles.bikeSpot,
                    { backgroundColor: STATUS_COLORS[moto.status] },
                  ]}
                  onPress={() => setSelectedMoto(moto)}
                >
                  <Text style={styles.bikeText}>Moto {moto.id}</Text>
                </TouchableOpacity>
              ))}
          </View>
        </View>
      ))}

      {selectedMoto && (
        <Modal transparent animationType="slide" visible={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Detalhes da Moto</Text>
              <Text style={styles.modalText}>ID: {selectedMoto.id}</Text>
              <Text style={styles.modalText}>
                Status Atual: {selectedMoto.status}
              </Text>
              <Text style={styles.modalText}>Setor: {selectedMoto.setor}</Text>

              <Text style={[styles.modalText, { marginTop: 15 }]}>
                Alterar status:
              </Text>
              <View style={styles.statusButtonsContainer}>
                {statusOptions.map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusButton,
                      { backgroundColor: STATUS_COLORS[status] },
                    ]}
                    onPress={() => handleStatusChange(status)}
                  >
                    <Text style={styles.statusButtonText}>{status}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setSelectedMoto(null)}
              >
                <Text style={styles.cancelButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
}
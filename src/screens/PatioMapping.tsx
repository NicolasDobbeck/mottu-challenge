import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator, // Para feedback de carregamento
  Alert, // Para feedback de erro
  RefreshControl, // Para a funcionalidade "puxar para atualizar"
} from "react-native";
import { useTheme, Text } from 'react-native-paper'; 
// Importando o nosso novo serviço e a interface Moto
import { Moto, getMotos, updateMoto } from "../services/motoService";
import { t } from '../services/i18n';

// Constantes permanecem as mesmas
const STATUS_COLORS: Record<string, string> = {
  LIVRE: "#05AF31",
  PROBLEMA: "#FF3B30",
  MANUTENCAO: "#FFD60A",
};
const statusOptions: Moto['status'][] = ["LIVRE", "PROBLEMA", "MANUTENCAO"];
const setores = ["A", "B", "C", "D"]; // Usando os valores exatos do seu backend

export default function PatioMapping() {
  const theme = useTheme();
  
  // Os nossos estados agora começam vazios
  const [motos, setMotos] = useState<Moto[]>([]);
  const [selectedMoto, setSelectedMoto] = useState<Moto | null>(null);
  const [loading, setLoading] = useState(true); // Para o carregamento inicial da tela
  const [refreshing, setRefreshing] = useState(false); // Para o "puxar para atualizar"
  
  // Função para buscar os dados da API
  const fetchMotos = async () => {
    try {
      const motosDoBackend = await getMotos();
      setMotos(motosDoBackend);
    } catch (error) {
      Alert.alert(t('patio.errorConnection'), t('patio.errorConnectionMsg'));
    }
  };

  // useEffect: Roda a função fetchMotos() uma vez quando o componente é montado
  useEffect(() => {
    setLoading(true);
    fetchMotos().finally(() => setLoading(false));
  }, []);

  // Função para a funcionalidade "puxar para atualizar"
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchMotos();
    setRefreshing(false);
  }, []);

  // Função para lidar com a mudança de status, agora comunica-se com a API
  const handleStatusChange = async (newStatus: Moto['status']) => {
    if (!selectedMoto) return;

    const originalMotos = [...motos]; // Salva o estado original para reverter em caso de erro
    const motoParaAtualizar = { ...selectedMoto, status: newStatus };

    // 1. Atualização Otimista: a interface é atualizada imediatamente
    setMotos(motos.map(m => m.idMoto === selectedMoto.idMoto ? motoParaAtualizar : m));
    setSelectedMoto(null); // Fecha o modal

    try {
      // 2. Envia a requisição para o backend
      // O endpoint PUT espera o objeto completo, então enviamos a moto inteira com o novo status
      await updateMoto(selectedMoto.idMoto, motoParaAtualizar);
    } catch (error) {
      // 3. Reversão: Se a API falhar, mostra um erro e volta a UI para o estado original
      Alert.alert(t('patio.errorNetwork'), t('patio.errorNetworkMsg'));
      setMotos(originalMotos);
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 25, paddingTop: 60, backgroundColor: theme.colors.background },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background },
    title: { fontSize: 24, marginBottom: 20, fontWeight: "bold", textAlign: "center", color: theme.colors.onBackground },
    sector: { marginBottom: 30 },
    sectorTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: theme.colors.onSurface },
    patio: { flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "center" },
    bikeSpot: { width: 80, height: 80, margin: 5, borderRadius: 10, justifyContent: "center", alignItems: "center" },
    bikeText: { color: "#fff", fontWeight: "bold" },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
    modalContent: { backgroundColor: theme.colors.surface, padding: 25, borderRadius: 10, width: "85%", elevation: 10 },
    modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10, textAlign: "center", color: theme.colors.onSurface },
    modalText: { fontSize: 16, marginBottom: 5, color: theme.colors.onSurface },
    statusButtonsContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 10, marginTop: 10 },
    statusButton: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, flex: 1, alignItems: "center", minWidth: "30%" },
    statusButtonText: { color: "#fff", fontWeight: "bold", textTransform: "capitalize" },
    cancelButton: { marginTop: 20, padding: 12, backgroundColor: theme.colors.backdrop, borderRadius: 8, alignItems: "center" },
    cancelButtonText: { fontWeight: "bold", color: theme.colors.onBackground },
  });

  // Renderiza um indicador de carregamento enquanto busca os dados pela primeira vez
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 10, color: theme.colors.onBackground }}>{t('patio.loading')}</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]}/>
    }>
      <Text style={styles.title}>{t('patio.title')}</Text>

      {setores.map((setor) => (
        <View key={setor} style={styles.sector}>
          <Text style={styles.sectorTitle}>{t('patio.sector', { setor: setor })}</Text>
          <View style={styles.patio}>
            {motos
              .filter((m) => m.setor === setor)
              .map((moto) => (
                <TouchableOpacity
                  key={moto.idMoto}
                  style={[
                    styles.bikeSpot,
                    { backgroundColor: STATUS_COLORS[moto.status] || '#808080' }, // Cor padrão caso o status seja inesperado
                  ]}
                  onPress={() => setSelectedMoto(moto)}
                >
                  <Text style={styles.bikeText}>{moto.placa}</Text>
                </TouchableOpacity>
              ))}
          </View>
        </View>
      ))}

      {selectedMoto && (
        <Modal transparent animationType="fade" visible={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t('patio.modalTitle')}</Text>
              <Text style={styles.modalText}>{t('patio.modalPlaca', { placa: selectedMoto.placa })}</Text>
              <Text style={styles.modalText}>
                {t('patio.modalStatus', { status: selectedMoto.status })}
              </Text>
              <Text style={styles.modalText}>{t('patio.modalSetor', { setor: selectedMoto.setor })}</Text>

              <Text style={[styles.modalText, { marginTop: 15, fontWeight: 'bold' }]}>
                {t('patio.modalChangeStatus')}
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
                <Text style={styles.cancelButtonText}>{t('patio.modalClose')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
}
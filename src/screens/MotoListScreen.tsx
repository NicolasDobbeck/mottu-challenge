import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Alert, RefreshControl, Modal } from 'react-native';
import { Text, FAB, useTheme, ActivityIndicator, IconButton, Portal, Dialog, Button, List } from 'react-native-paper'; // Importei o List
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RouteProp, useRoute } from '@react-navigation/native';
import { PatioStackParamList } from '../navigation/PatioStack';
import { Moto, getMotosByPatio, createMoto, updateMoto, deleteMoto, MotoFormData } from '../services/motoService';
import MotoFormModal from '../components/MotoFormModal';
import { t } from '../services/i18n';

const STATUS_COLORS: Record<string, string> = {
  LIVRE: "#05AF31",
  PROBLEMA: "#FF3B30",
  MANUTENCAO: "#FFD60A",
};
const statusOptions: Moto['status'][] = ["LIVRE", "PROBLEMA", "MANUTENCAO"];
const setores = ["A", "B", "C", "D"]; 

type MotoListRouteProp = RouteProp<PatioStackParamList, 'MotoList'>;

const MotoListScreen: React.FC = () => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const route = useRoute<MotoListRouteProp>();
  
  const { patioId } = route.params; 

  const [formModalVisible, setFormModalVisible] = useState(false); // Modal do Formulário
  const [statusModalVisible, setStatusModalVisible] = useState(false); // Modal de Status
  const [selectedMoto, setSelectedMoto] = useState<Moto | null>(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  // Busca as motos daquele pátio
  const { data: motos, isLoading, error, refetch } = useQuery<Moto[], Error>({
    queryKey: ['motos', patioId], 
    queryFn: () => getMotosByPatio(patioId),
  });

  const handleMutationSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['motos', patioId] });
    setFormModalVisible(false);
    setStatusModalVisible(false);
    setSelectedMoto(null);
  };

  const handleMutationError = (error: Error, action: string) => {
    const actionT = t(`filiais.error${action.charAt(0).toUpperCase() + action.slice(1)}` as 'filiais.errorCreate');
    Alert.alert(t('filiais.errorAlertTitle'), t('filiais.errorAlertMsg', { action: actionT }));
  };
  const createMutation = useMutation({ mutationFn: createMoto, onSuccess: handleMutationSuccess, onError: (err) => handleMutationError(err, 'criar') });
  const updateMutation = useMutation({ mutationFn: ({ id, data }: { id: string; data: MotoFormData }) => updateMoto(id, data), onSuccess: handleMutationSuccess, onError: (err) => handleMutationError(err, 'atualizar') });
  const deleteMutation = useMutation({
    mutationFn: deleteMoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motos', patioId] });
      setDeleteDialogVisible(false);
      setSelectedMoto(null);
      setStatusModalVisible(false);
      Alert.alert(t('filiais.successDeleteTitle'), t('moto.successDeleteMsg'));
    },
    onError: (err) => handleMutationError(err, 'excluir'),
  });

  const openNewForm = () => {
    setSelectedMoto(null); 
    setFormModalVisible(true);
  };

  const openStatusModal = (moto: Moto) => {
    setSelectedMoto(moto);
    setStatusModalVisible(true);
  };

  const openEditForm = () => {
    setStatusModalVisible(false);
    setFormModalVisible(true); 
  };

  const openDeleteDialog = () => {
    setStatusModalVisible(false); 
    setDeleteDialogVisible(true); 
  };

  const confirmDelete = () => {
    if (selectedMoto) {
      deleteMutation.mutate(selectedMoto.idMoto);
    }
  };

  const handleSubmitForm = (data: MotoFormData, id?: string) => {
    const dataComPatio = { ...data, idPatio: patioId };
    if (id) {
      updateMutation.mutate({ id, data: dataComPatio });
    } else {
      createMutation.mutate(dataComPatio);
    }
  };

  const handleStatusChange = async (newStatus: Moto['status']) => {
    if (!selectedMoto) return;

    const motoData: MotoFormData = {
      placa: selectedMoto.placa,
      chassi: selectedMoto.chassi,
      modelo: selectedMoto.modelo,
      setor: selectedMoto.setor,
      idPatio: selectedMoto.idPatio || patioId, 
      status: newStatus, 
      idOperador: selectedMoto.idOperador,
    };
    
    updateMutation.mutate({ id: selectedMoto.idMoto, data: motoData });
  };
  
  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator animating={true} color={theme.colors.primary} size="large" />
        <Text style={{ marginTop: 10 }}>{t('moto.loading')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.error }}>{t('filiais.error')}</Text>
        <Button onPress={() => refetch()}>{t('filiais.retry')}</Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer} 
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} colors={[theme.colors.primary]}/>
      }>
        {/* Renderiza o Grid de Setores (Layout do seu PatioMapping original) */}
        {setores.map((setor) => (
          <View key={setor} style={styles.sector}>
            <Text style={styles.sectorTitle}>{t('patio.sector', { setor: setor })}</Text>
            <View style={styles.patio}>
              {motos
                ?.filter((m) => m.setor === setor)
                .map((moto) => (
                  <TouchableOpacity
                    key={moto.idMoto}
                    style={[
                      styles.bikeSpot,
                      { backgroundColor: STATUS_COLORS[moto.status] || '#808080' },
                    ]}
                    onPress={() => openStatusModal(moto)}
                  >
                    <Text style={styles.bikeText}>{moto.placa}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Botão de Adicionar Moto (abre o formulário) */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={openNewForm}
        color={theme.colors.onPrimary}
      />

      {/* Modal de Mapeamento de Status (O seu modal original) */}
      {selectedMoto && (
        <Modal
          transparent
          animationType="fade"
          visible={statusModalVisible}
          onRequestClose={() => setStatusModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>{t('patio.modalTitle')}</Text>
              <Text style={[styles.modalText, { color: theme.colors.onSurface }]}>{t('patio.modalPlaca', { placa: selectedMoto.placa })}</Text>
              <Text style={[styles.modalText, { color: theme.colors.onSurface }]}>{t('moto.form.status')}: {t(`moto.status.${selectedMoto.status}`)}</Text>
              <Text style={[styles.modalText, { color: theme.colors.onSurface }]}>{t('moto.form.setor')}: {t(`moto.setores.${selectedMoto.setor}`)}</Text>

              <Text style={[styles.modalText, { marginTop: 15, fontWeight: 'bold', color: theme.colors.onSurface }]}>
                {t('patio.modalChangeStatus')}
              </Text>
              <View style={styles.statusButtonsContainer}>
                {statusOptions.map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[styles.statusButton, { backgroundColor: STATUS_COLORS[status] }]}
                    onPress={() => handleStatusChange(status)}
                  >
                    <Text style={styles.statusButtonText}>{t(`moto.status.${status}`)}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Botões de Editar e Deletar */}
              <View style={styles.editDeleteContainer}>
                <Button icon="pencil" mode="outlined" onPress={openEditForm}>
                  Editar
                </Button>
                <Button icon="delete" mode="outlined" onPress={openDeleteDialog} buttonColor={theme.colors.errorContainer} textColor={theme.colors.error}>
                  Excluir
                </Button>
              </View>

              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: theme.colors.backdrop }]}
                onPress={() => setStatusModalVisible(false)}
              >
                <Text style={[styles.cancelButtonText, { color: theme.colors.onBackground }]}>{t('patio.modalClose')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Modal de Criar/Editar Moto (O formulário) */}
      <MotoFormModal
        visible={formModalVisible}
        onClose={() => setFormModalVisible(false)}
        onSubmit={handleSubmitForm}
        moto={selectedMoto}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Modal de Deletar Moto */}
      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)} style={{ backgroundColor: theme.colors.surface }}>
          <Dialog.Title style={{ color: theme.colors.onSurface }}>{t('moto.deleteTitle')}</Dialog.Title>
          <Dialog.Content>
            <Text style={{ color: theme.colors.onSurface }}>{t('moto.deleteMsg', { placa: selectedMoto?.placa })}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>{t('filiais.cancel')}</Button>
            <Button onPress={confirmDelete} loading={deleteMutation.isPending} disabled={deleteMutation.isPending} textColor={theme.colors.error}>{t('filiais.delete')}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flex: 1, paddingHorizontal: 25, paddingTop: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sector: { marginBottom: 30 },
  sectorTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  patio: { flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "center" },
  bikeSpot: { width: 80, height: 80, margin: 5, borderRadius: 10, justifyContent: "center", alignItems: "center", elevation: 3 },
  bikeText: { color: "#fff", fontWeight: "bold" },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0 },
  // Estilos do Modal (do seu PatioMapping original)
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
  modalContent: { padding: 25, borderRadius: 10, width: "85%", elevation: 10 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  modalText: { fontSize: 16, marginBottom: 5 },
  statusButtonsContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 10, marginTop: 10 },
  statusButton: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, flex: 1, alignItems: "center", minWidth: "30%" },
  statusButtonText: { color: "#fff", fontWeight: "bold" },
  cancelButton: { marginTop: 20, padding: 12, borderRadius: 8, alignItems: "center" },
  cancelButtonText: { fontWeight: "bold" },
  editDeleteContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 15 }
});

export default MotoListScreen;
import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Appbar, Card, Text, FAB, useTheme, ActivityIndicator, IconButton, Portal, Dialog, Button } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PatioStackParamList } from '../navigation/PatioStack';
import { Patio, getPatios, createPatio, updatePatio, deletePatio, PatioFormData } from '../services/patioService';
import PatioFormModal from '../components/PatioFormModal';
import { t } from '../services/i18n';

type PatioListNavigationProp = StackNavigationProp<PatioStackParamList, 'PatioList'>;

const PatioListScreen: React.FC = () => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const navigation = useNavigation<PatioListNavigationProp>();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPatio, setSelectedPatio] = useState<Patio | null>(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [patioToDelete, setPatioToDelete] = useState<Patio | null>(null);

  const { data, isLoading, error, refetch } = useQuery<Patio[], Error>({
    queryKey: ['patios'],
    queryFn: getPatios,
  });

  const handleMutationSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['patios'] });
    setModalVisible(false);
    setSelectedPatio(null);
  };

  const handleMutationError = (error: Error, action: string) => {
    const actionT = t(`filiais.error${action.charAt(0).toUpperCase() + action.slice(1)}` as 'filiais.errorCreate');
    Alert.alert(t('filiais.errorAlertTitle'), t('filiais.errorAlertMsg', { action: actionT }));
  };

  const createMutation = useMutation({
    mutationFn: createPatio,
    onSuccess: handleMutationSuccess,
    onError: (err) => handleMutationError(err, 'criar'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PatioFormData }) => updatePatio(id, data),
    onSuccess: handleMutationSuccess,
    onError: (err) => handleMutationError(err, 'atualizar'),
  });

  const deleteMutation = useMutation({
    mutationFn: deletePatio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patios'] });
      setDeleteDialogVisible(false);
      setPatioToDelete(null);
      Alert.alert(t('filiais.successDeleteTitle'), "Pátio excluído com sucesso."); // TODO: i18n
    },
    onError: (err) => {
      handleMutationError(err, 'excluir');
      setDeleteDialogVisible(false);
    },
  });

  const openNewForm = () => setModalVisible(true);
  const openEditForm = (patio: Patio) => { setSelectedPatio(patio); setModalVisible(true); };
  const openDeleteDialog = (patio: Patio) => { setPatioToDelete(patio); setDeleteDialogVisible(true); };
  const confirmDelete = () => { if (patioToDelete) { deleteMutation.mutate(patioToDelete.idPatio); } };
  const handleSubmit = (data: PatioFormData, id?: string) => { if (id) { updateMutation.mutate({ id, data }); } else { createMutation.mutate(data); } };
  const handleNavigateToMotos = (patio: Patio) => { navigation.navigate('MotoList', { patioId: patio.idPatio, patioName: patio.nome }); };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator animating={true} color={theme.colors.primary} size="large" />
          <Text style={{ marginTop: 10 }}>{t('patio.loading')}</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.center}>
          <Text style={{ color: theme.colors.error, marginBottom: 10 }}>{t('filiais.error')}</Text>
          <Button onPress={() => refetch()}>{t('filiais.retry')}</Button>
        </View>
      );
    }

    return (
      <FlatList
        data={data}
        keyExtractor={(item) => item.idPatio}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card style={styles.card} onPress={() => handleNavigateToMotos(item)}>
            <Card.Title
              title={item.nome}
              subtitle={item.descricao || "Pátio sem descrição"}
              titleStyle={{ color: theme.colors.onSurface }}
              subtitleStyle={{ color: theme.colors.onSurfaceVariant }}
            />
            <Card.Actions>
              <IconButton icon="pencil" iconColor={theme.colors.primary} onPress={() => openEditForm(item)} />
              <IconButton icon="delete" iconColor={theme.colors.error} onPress={() => openDeleteDialog(item)} />
            </Card.Actions>
          </Card>
        )}
        ListEmptyComponent={() => (
          <View style={styles.center}>
            <Text>{t('filiais.empty')}</Text> 
          </View>
        )}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {renderContent()}

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={openNewForm}
        color={theme.colors.onPrimary}
        visible={!isLoading} 
      />

      {/* Modais */}
      <PatioFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        patio={selectedPatio}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>{t('filiais.deleteTitle')}</Dialog.Title>
          <Dialog.Content>
            <Text>{t('filiais.deleteMsg', { nome: patioToDelete?.nome })}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>{t('filiais.cancel')}</Button>
            <Button onPress={confirmDelete} loading={deleteMutation.isPending} disabled={deleteMutation.isPending}>{t('filiais.delete')}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, textAlign: 'center' },
  list: { padding: 16, minHeight: '100%' },
  card: { marginBottom: 16 },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0 },
});

export default PatioListScreen;
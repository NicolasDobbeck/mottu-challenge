import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Appbar, Card, Text, FAB, useTheme, ActivityIndicator, IconButton, Portal, Dialog, Button } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFiliais, createFilial, updateFilial, deleteFilial, Filial, FilialFormData } from '../services/filialService';
import FilialFormModal from '../components/FilialFormModal';
import { t } from '../services/i18n';

const FiliaisScreen: React.FC = () => {
  const theme = useTheme();
  const queryClient = useQueryClient();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilial, setSelectedFilial] = useState<Filial | null>(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [filialToDelete, setFilialToDelete] = useState<Filial | null>(null);

  // Busca de dados com React Query
  const { data, isLoading, error, refetch } = useQuery<Filial[], Error>({
    queryKey: ['filiais'],
    queryFn: getFiliais,
  });

  const handleMutationSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['filiais'] });
    setModalVisible(false);
    setSelectedFilial(null);
  };

  const handleMutationError = (error: Error, action: string) => {
    const actionT = t(`filiais.error${action.charAt(0).toUpperCase() + action.slice(1)}` as 'filiais.errorCreate');
    Alert.alert(t('filiais.errorAlertTitle'), t('filiais.errorAlertMsg', { action: actionT }));
  };

  // Mutações
  const createMutation = useMutation({
    mutationFn: createFilial,
    onSuccess: handleMutationSuccess,
    onError: (err) => handleMutationError(err, 'criar'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FilialFormData & { dataAbertura: string } }) => updateFilial(id, data),
    onSuccess: handleMutationSuccess,
    onError: (err) => handleMutationError(err, 'atualizar'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFilial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filiais'] });
      setDeleteDialogVisible(false);
      setFilialToDelete(null);
      Alert.alert(t('filiais.successDeleteTitle'), t('filiais.successDeleteMsg'));
    },
    onError: (err) => {
      handleMutationError(err, 'excluir');
      setDeleteDialogVisible(false);
    },
  });

  const openNewForm = () => {
    setSelectedFilial(null);
    setModalVisible(true);
  };

  const openEditForm = (filial: Filial) => {
    setSelectedFilial(filial);
    setModalVisible(true);
  };
  
  const openDeleteDialog = (filial: Filial) => {
    setFilialToDelete(filial);
    setDeleteDialogVisible(true);
  };

  const confirmDelete = () => {
    if (filialToDelete) {
      deleteMutation.mutate(filialToDelete.idFilial);
    }
  };

  const handleSubmit = (data: FilialFormData, id?: string) => {
    if (id && selectedFilial) {
      updateMutation.mutate({ id, data: { ...data, dataAbertura: selectedFilial.dataAbertura } });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator animating={true} color={theme.colors.primary} size="large" />
        <Text style={{ marginTop: 10 }}>{t('filiais.loading')}</Text>
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
        <Appbar.Content title={t('filiais.title')} color={theme.colors.onPrimary} />
      </Appbar.Header>

      <FlatList
        data={data}
        keyExtractor={(item) => item.idFilial}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title
              title={item.nome}
              subtitle={t('filiais.subtitle', { cnpj: item.cnpj, pais: item.cdPais })}
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

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={openNewForm}
        color={theme.colors.onPrimary}
      />

      <FilialFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        filial={selectedFilial}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>{t('filiais.deleteTitle')}</Dialog.Title>
          <Dialog.Content>
            <Text>{t('filiais.deleteMsg', { nome: filialToDelete?.nome })}</Text>
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
  card: { marginBottom: 16 },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0 },
});

export default FiliaisScreen;
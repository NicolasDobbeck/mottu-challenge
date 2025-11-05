import React, { useState, useEffect } from 'react';
import { View, Modal, ScrollView, Alert, StyleSheet, Platform } from 'react-native';
import { Appbar, TextInput, Button, useTheme, Text } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';

import { PatioFormData, Patio } from '../services/patioService';
import { Filial, getFiliais } from '../services/filialService';
import { t } from '../services/i18n';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: PatioFormData, id?: string) => void;
  patio?: Patio | null;
  isLoading: boolean;
}

const PatioFormModal: React.FC<Props> = ({ visible, onClose, onSubmit, patio, isLoading }) => {
  const theme = useTheme();
  
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [idFilial, setIdFilial] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Busca as filiais para o dropdown
  // Só busca (enabled: true) quando o modal estiver visível
  const { data: filiais, isLoading: isLoadingFiliais } = useQuery<Filial[], Error>({
    queryKey: ['filiais'], 
    queryFn: getFiliais,
    enabled: visible, 
  });

  // Efeito para popular o formulário ao editar
  useEffect(() => {
    if (visible) {
      if (patio) {
        // Modo Edição
        setNome(patio.nome || '');
        setDescricao(patio.descricao || '');
        setIdFilial(patio.idFilial || null);
      } else {
        // Modo Criação
        setNome('');
        setDescricao('');
        setIdFilial(null);
      }
      setErrors({});
    }
  }, [patio, visible]);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!nome.trim()) newErrors.nome = t('patio.form.nameRequired');
    if (!descricao.trim()) newErrors.descricao = 'A descrição é obrigatória.'; // (Adicione i18n se quiser)
    if (!idFilial) newErrors.idFilial = t('patio.form.filialRequired');
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit({ nome, descricao, idFilial: idFilial! }, patio?.idPatio);
    } else {
      Alert.alert(t('common.error'), t('patio.form.validationError'));
    }
  };

  // Formata os dados para o RNPickerSelect
  const filialOptions = (filiais || []).map(filial => ({
    label: filial.nome,
    value: filial.idFilial,
  }));

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide">
      <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
        <Appbar.Action icon="close" onPress={onClose} color={theme.colors.onPrimary} />
        <Appbar.Content 
          title={patio ? t('patio.form.titleUpdate') : t('patio.form.titleCreate')} 
          color={theme.colors.onPrimary} 
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
        <TextInput
          label={t('patio.form.name')}
          value={nome}
          onChangeText={setNome}
          mode="outlined"
          style={styles.input}
          error={!!errors.nome}
        />
        {errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}

        <TextInput
          label={t('patio.form.description')}
          value={descricao}
          onChangeText={setDescricao}
          mode="outlined"
          style={styles.input}
          error={!!errors.descricao}
        />
        {errors.descricao && <Text style={styles.errorText}>{errors.descricao}</Text>}

        {/* --- SUBSTITUIÇÃO DO <Menu> --- */}
        <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>{t('patio.form.filial')}</Text>
        <RNPickerSelect
          placeholder={{ label: t('patio.form.selectFilial'), value: null }}
          items={filialOptions}
          onValueChange={(value) => setIdFilial(value)}
          value={idFilial}
          style={pickerSelectStyles(theme)}
          Icon={() => {
            return <Ionicons name="chevron-down" size={24} color={theme.colors.onSurfaceVariant} />;
          }}
          disabled={isLoadingFiliais}
          useNativeAndroidPickerStyle={false} // Garante o estilo customizado no Android
        />
        {errors.idFilial && <Text style={styles.errorText}>{errors.idFilial}</Text>}
        {/* --- FIM DA SUBSTITUIÇÃO --- */}
        
        <View style={{ height: 20 }} />

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
          style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
          labelStyle={{ color: theme.colors.onPrimary }}
        >
          {isLoading ? t('patio.form.saving') : (patio ? t('patio.form.update') : t('patio.form.create'))}
        </Button>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },
  input: {
    marginBottom: 10,
  },
  errorText: {
    color: 'red', // TODO: use theme.colors.error
    marginBottom: 10,
    fontSize: 12,
  },
  label: {
    fontSize: 12,
    paddingLeft: 12,
    paddingTop: 8,
  },
  saveButton: {
    paddingVertical: 8,
    marginTop: 20,
  }
});

// Estilos para o RNPickerSelect
const pickerSelectStyles = (theme: any) => StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: theme.roundness,
    color: theme.colors.onSurface,
    paddingRight: 30,
    backgroundColor: theme.colors.surface,
    marginTop: 5,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: theme.roundness,
    color: theme.colors.onSurface,
    paddingRight: 30,
    backgroundColor: theme.colors.surface,
    marginTop: 5,
  },
  iconContainer: {
    top: Platform.OS === 'ios' ? 18 : 22,
    right: 15,
  },
  placeholder: {
    color: theme.colors.onSurfaceVariant,
  },
});

export default PatioFormModal;
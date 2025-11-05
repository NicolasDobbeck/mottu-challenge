import React, { useState, useEffect } from 'react';
import { View, Modal, ScrollView, Alert, StyleSheet, Platform } from 'react-native';
import { Appbar, TextInput, Button, useTheme, Text } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';
import { MotoFormData, Moto } from '../services/motoService';
import { t } from '../services/i18n';

// --- Constantes para os Pickers ---
const statusOptions = [
  { label: t('moto.status.LIVRE'), value: 'LIVRE' as 'LIVRE' },
  { label: t('moto.status.PROBLEMA'), value: 'PROBLEMA' as 'PROBLEMA' },
  { label: t('moto.status.MANUTENCAO'), value: 'MANUTENCAO' as 'MANUTENCAO' },
];
const setorOptions = [
  { label: t('moto.setores.A'), value: 'A' as 'A' },
  { label: t('moto.setores.B'), value: 'B' as 'B' },
  { label: t('moto.setores.C'), value: 'C' as 'C' },
  { label: t('moto.setores.D'), value: 'D' as 'D' },
];
const modeloOptions = [
  { label: 'MOTTUPOP', value: 'MOTTUPOP' as 'MOTTUPOP' },
  { label: 'MOTTUE', value: 'MOTTUE' as 'MOTTUE' },
  { label: 'MOTTUSPORT', value: 'MOTTUSPORT' as 'MOTTUSPORT' },
];

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: MotoFormData, id?: string) => void;
  moto?: Moto | null;
  isLoading: boolean;
}

const MotoFormModal: React.FC<Props> = ({ visible, onClose, onSubmit, moto, isLoading }) => {
  const theme = useTheme();

  // --- CORREÇÃO: Tipagem explícita no useState ---
  const [placa, setPlaca] = useState('');
  const [chassi, setChassi] = useState('');
  const [modelo, setModelo] = useState<MotoFormData['modelo']>(modeloOptions[0].value);
  const [status, setStatus] = useState<MotoFormData['status']>(statusOptions[0].value);
  const [setor, setSetor] = useState<MotoFormData['setor']>(setorOptions[0].value);
  // --- Fim da Correção ---
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  useEffect(() => {
    if (visible) {
      if (moto) {
        setPlaca(moto.placa || '');
        setChassi(moto.chassi || '');
        setModelo(moto.modelo || modeloOptions[0].value);
        setStatus(moto.status || statusOptions[0].value);
        setSetor(moto.setor || setorOptions[0].value);
      } else {
        setPlaca('');
        setChassi('');
        setModelo(modeloOptions[0].value);
        setStatus(statusOptions[0].value);
        setSetor(setorOptions[0].value);
      }
      setErrors({});
    }
  }, [moto, visible]);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!placa.trim()) newErrors.placa = t('moto.form.placaRequired');
    if (!chassi.trim()) newErrors.chassi = t('moto.form.chassiRequired');
    if (!modelo) newErrors.modelo = t('moto.form.modeloRequired');
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      // Agora 'modelo', 'status', e 'setor' têm os tipos corretos
      onSubmit({ placa, chassi, modelo, status, setor, idPatio: '', idOperador: null }, moto?.idMoto);
    } else {
      Alert.alert(t('common.error'), t('patio.form.validationError')); 
    }
  };

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide">
      <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
        <Appbar.Action icon="close" onPress={onClose} color={theme.colors.onPrimary} />
        <Appbar.Content 
          title={moto ? t('moto.form.titleUpdate') : t('moto.form.titleCreate')} 
          color={theme.colors.onPrimary} 
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
        
        <TextInput
          label={t('moto.form.placa')}
          value={placa}
          onChangeText={setPlaca}
          mode="outlined"
          style={styles.input}
          error={!!errors.placa}
          autoCapitalize="characters"
        />
        {errors.placa && <Text style={styles.errorText}>{errors.placa}</Text>}

        <TextInput
          label={t('moto.form.chassi')}
          value={chassi}
          onChangeText={setChassi}
          mode="outlined"
          style={styles.input}
          error={!!errors.chassi}
          autoCapitalize="characters"
        />
        {errors.chassi && <Text style={styles.errorText}>{errors.chassi}</Text>}

        {/* Dropdown Modelo */}
        <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>{t('moto.form.modelo')}</Text>
        <RNPickerSelect
          placeholder={{}}
          items={modeloOptions}
          onValueChange={(value) => {
            if (value) setModelo(value); // Garante que não é null
          }}
          value={modelo}
          style={pickerSelectStyles(theme)}
          Icon={() => <Ionicons name="chevron-down" size={24} color={theme.colors.onSurfaceVariant} />}
          useNativeAndroidPickerStyle={false}
        />

        {/* Dropdown Status */}
        <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>{t('moto.form.status')}</Text>
        <RNPickerSelect
          placeholder={{}}
          items={statusOptions}
          onValueChange={(value) => {
            if (value) setStatus(value);
          }}
          value={status}
          style={pickerSelectStyles(theme)}
          Icon={() => <Ionicons name="chevron-down" size={24} color={theme.colors.onSurfaceVariant} />}
          useNativeAndroidPickerStyle={false}
        />

        {/* Dropdown Setor */}
        <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>{t('moto.form.setor')}</Text>
        <RNPickerSelect
          placeholder={{}}
          items={setorOptions}
          onValueChange={(value) => {
            if (value) setSetor(value);
          }}
          value={setor}
          style={pickerSelectStyles(theme)}
          Icon={() => <Ionicons name="chevron-down" size={24} color={theme.colors.onSurfaceVariant} />}
          useNativeAndroidPickerStyle={false}
        />

        <View style={{ height: 20 }} />

        {/* Botão Salvar */}
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
          style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
          labelStyle={{ color: theme.colors.onPrimary }}
        >
          {isLoading ? t('moto.form.saving') : (moto ? t('moto.form.update') : t('moto.form.create'))}
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
    paddingTop: 10,
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
    marginBottom: 10, 
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
    marginBottom: 10,
  },
  iconContainer: {
    top: Platform.OS === 'ios' ? 18 : 22,
    right: 15,
  },
  placeholder: {
    color: theme.colors.onSurfaceVariant,
  },
});

export default MotoFormModal;
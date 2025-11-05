import React, { useState, useEffect } from 'react';
import { View, Modal, ScrollView, Alert, StyleSheet } from 'react-native';
import { Appbar, TextInput, Button, useTheme, Text, Menu } from 'react-native-paper';
import { MotoFormData, Moto } from '../services/motoService'; // Importa as interfaces de Moto
import { t } from '../services/i18n';

// --- Opções para os Dropdowns ---
// (Estas são as chaves. Os valores traduzidos virão do i18n)
const statusOptions: MotoFormData['status'][] = ["LIVRE", "PROBLEMA", "MANUTENCAO"];
const setorOptions: MotoFormData['setor'][] = ["A", "B", "C", "D"];
const modeloOptions: MotoFormData['modelo'][] = ["MOTTUPOP", "MOTTUE", "MOTTUSPORT"]; // Adicionando modelos

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: MotoFormData, id?: string) => void;
  moto?: Moto | null;
  isLoading: boolean;
}

const MotoFormModal: React.FC<Props> = ({ visible, onClose, onSubmit, moto, isLoading }) => {
  const theme = useTheme();

  // --- Estados do Formulário ---
  const [placa, setPlaca] = useState('');
  const [chassi, setChassi] = useState('');
  const [modelo, setModelo] = useState(modeloOptions[0]);
  const [status, setStatus] = useState(statusOptions[0]);
  const [setor, setSetor] = useState(setorOptions[0]);
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // Estados para visibilidade dos menus
  const [modeloMenuVisible, setModeloMenuVisible] = useState(false);
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);
  const [setorMenuVisible, setSetorMenuVisible] = useState(false);

  // Efeito para popular o formulário ao editar
  useEffect(() => {
    if (visible) {
      if (moto) {
        // Modo Edição
        setPlaca(moto.placa || '');
        setChassi(moto.chassi || '');
        setModelo(moto.modelo || modeloOptions[0]);
        setStatus(moto.status || statusOptions[0]);
        setSetor(moto.setor || setorOptions[0]);
      } else {
        // Modo Criação (limpa o form)
        setPlaca('');
        setChassi('');
        setModelo(modeloOptions[0]);
        setStatus(statusOptions[0]);
        setSetor(setorOptions[0]);
      }
      setErrors({});
    }
  }, [moto, visible]);

  // Validação
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
      onSubmit({ placa, chassi, modelo, status, setor, idPatio: '', idOperador: null }, moto?.idMoto);
    } else {
      Alert.alert(t('common.error'), t('patio.form.validationError')); // Reutiliza chave
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
        
        {/* Campo Placa */}
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

        {/* Campo Chassi */}
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
        <Menu
          visible={modeloMenuVisible}
          onDismiss={() => setModeloMenuVisible(false)}
          anchor={
            <Button
              onPress={() => setModeloMenuVisible(true)}
              mode="outlined"
              icon="chevron-down"
              contentStyle={styles.dropdownButtonContent}
              style={styles.dropdownButton}
              labelStyle={{ color: theme.colors.onSurface }}
            >
              {t('moto.form.modelo')}: {modelo}
            </Button>
          }
        >
          {modeloOptions.map(option => (
            <Menu.Item
              key={option}
              onPress={() => { setModelo(option); setModeloMenuVisible(false); }}
              title={option}
            />
          ))}
        </Menu>

        {/* Dropdown Status */}
        <Menu
          visible={statusMenuVisible}
          onDismiss={() => setStatusMenuVisible(false)}
          anchor={
            <Button
              onPress={() => setStatusMenuVisible(true)}
              mode="outlined"
              icon="chevron-down"
              contentStyle={styles.dropdownButtonContent}
              style={styles.dropdownButton}
              labelStyle={{ color: theme.colors.onSurface }}
            >
              {t('moto.form.status')}: {t(`moto.status.${status}` as 'moto.status.LIVRE')}
            </Button>
          }
        >
          {statusOptions.map(option => (
            <Menu.Item
              key={option}
              onPress={() => { setStatus(option); setStatusMenuVisible(false); }}
              title={t(`moto.status.${option}` as 'moto.status.LIVRE')}
            />
          ))}
        </Menu>

        {/* Dropdown Setor */}
        <Menu
          visible={setorMenuVisible}
          onDismiss={() => setSetorMenuVisible(false)}
          anchor={
            <Button
              onPress={() => setSetorMenuVisible(true)}
              mode="outlined"
              icon="chevron-down"
              contentStyle={styles.dropdownButtonContent}
              style={styles.dropdownButton}
              labelStyle={{ color: theme.colors.onSurface }}
            >
              {t('moto.form.setor')}: {t(`moto.setores.${setor}` as 'moto.setores.A')}
            </Button>
          }
        >
          {setorOptions.map(option => (
            <Menu.Item
              key={option}
              onPress={() => { setSetor(option); setSetorMenuVisible(false); }}
              title={t(`moto.setores.${option}` as 'moto.setores.A')}
            />
          ))}
        </Menu>

        <View style={{ height: 20 }} />

        {/* Botão Salvar */}
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
          style={styles.saveButton}
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
    color: 'red', // Ajuste para theme.colors.error
    marginBottom: 10,
    fontSize: 12,
  },
  dropdownButton: {
    paddingVertical: 8,
    borderColor: 'gray', // Ajuste para theme.colors.outline
    marginTop: 10,
  },
  dropdownButtonContent: {
    justifyContent: 'space-between',
    flexDirection: 'row-reverse'
  },
  saveButton: {
    paddingVertical: 8,
    backgroundColor: '#05AF31', // Ajuste para theme.colors.primary
    marginTop: 20,
  }
});

export default MotoFormModal;
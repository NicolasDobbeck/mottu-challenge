import React, { useState, useEffect } from 'react';
import { View, Modal, ScrollView, Alert } from 'react-native';
import { Appbar, TextInput, Button, useTheme, Text, Menu } from 'react-native-paper';
import { FilialFormData, Filial } from '../services/filialService'; // Importa a interface Filial correta
import { t } from '../services/i18n';

// Opções para o dropdown de Código do País
const paisOptions = [
  { label: 'Brasil (BR)', value: 'BR' },
  { label: 'Portugal (PT)', value: 'PT' },
  { label: 'Estados Unidos (US)', value: 'US' },
];

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: FilialFormData, id?: string) => void;
  filial?: Filial | null; // Usa a interface Filial
  isLoading: boolean;
}

const FilialFormModal: React.FC<Props> = ({ visible, onClose, onSubmit, filial, isLoading }) => {
  const theme = useTheme();
  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [cdPais, setCdPais] = useState(paisOptions[0].value); // Valor padrão
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    if (filial) {
      setNome(filial.nome || '');
      setCnpj(filial.cnpj || '');
      setCdPais(filial.cdPais || paisOptions[0].value);
    } else {
      // Limpa o formulário ao abrir para criar uma nova filial
      setNome('');
      setCnpj('');
      setCdPais(paisOptions[0].value);
    }
    setErrors({}); // Limpa os erros sempre que o modal abre ou a filial muda
  }, [filial, visible]);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!nome.trim()) newErrors.nome = t('filiais.form.nameRequired');
    if (!cnpj.trim()) {
      newErrors.cnpj = t('filiais.form.cnpjRequired');
    } else if (cnpj.length > 18) { // Ajuste para o formato com máscara (ex: 00.000.000/0000-00)
      newErrors.cnpj = t('filiais.form.cnpjLong');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit({ nome, cnpj, cdPais }, filial?.idFilial);
    } else {
      Alert.alert(t('common.error'), t('filiais.form.validationError'));
    }
  };

  const selectedLabel = paisOptions.find(p => p.value === cdPais)?.label || t('filiais.form.select');

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide">
      <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
        <Appbar.Action icon="close" onPress={onClose} color={theme.colors.onPrimary} />
        <Appbar.Content title={filial ? t('filiais.form.titleUpdate') : t('filiais.form.titleCreate')} color={theme.colors.onPrimary} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={{ padding: 20, backgroundColor: theme.colors.background, flexGrow: 1 }}>
        <TextInput
          label={t('filiais.form.name')}
          value={nome}
          onChangeText={setNome}
          mode="outlined"
          style={{ marginBottom: 10 }}
          error={!!errors.nome}
        />
        {errors.nome && <Text style={{ color: theme.colors.error, marginBottom: 10 }}>{errors.nome}</Text>}

        <TextInput
          label={t('filiais.form.cnpj')}
          value={cnpj}
          onChangeText={setCnpj}
          mode="outlined"
          style={{ marginBottom: 10 }}
          error={!!errors.cnpj}
          keyboardType="numeric"
        />
        {errors.cnpj && <Text style={{ color: theme.colors.error, marginBottom: 10 }}>{errors.cnpj}</Text>}

        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              onPress={() => setMenuVisible(true)}
              mode="outlined"
              icon="chevron-down"
              contentStyle={{ justifyContent: 'space-between', flexDirection: 'row-reverse' }}
              style={{ paddingVertical: 8, borderColor: theme.colors.outline }}
            >
              {selectedLabel}
            </Button>
          }
        >
          {paisOptions.map(option => (
            <Menu.Item
              key={option.value}
              onPress={() => {
                setCdPais(option.value);
                setMenuVisible(false);
              }}
              title={option.label}
            />
          ))}
        </Menu>
        
        <View style={{ height: 20 }} />

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
          style={{ paddingVertical: 8, backgroundColor: theme.colors.primary }}
          labelStyle={{ color: theme.colors.onPrimary }}
        >
          {isLoading ? t('filiais.form.saving') : (filial ? t('filiais.form.update') : t('filiais.form.create'))}
        </Button>
      </ScrollView>
    </Modal>
  );
};

export default FilialFormModal;
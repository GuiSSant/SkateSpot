import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useState } from 'react';

type ModalityFormProps = {
  onSubmit: (data: { name: string; description?: string }) => void;
  initialData?: { name?: string; description?: string };
};

export default function ModalityForm({ onSubmit, initialData = {} }: ModalityFormProps) {
  const [name, setName] = useState(initialData.name || '');
  const [description, setDescription] = useState(initialData.description || '');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Digite o nome"
      />
      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Descrição (opcional)"
        multiline
      />
      <Button title="Salvar" onPress={() => onSubmit({ name, description })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
    marginBottom: 12,
  },
});

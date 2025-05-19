import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useState } from 'react';

type StructureFormProps = {
  onSubmit: (data: {
    name: string;
    description: string;
    skatespot_id?: number[];
    modality_id?: number[];
  }) => void;
  initialData?: {
    name?: string;
    description?: string;
    skatespot_id?: number[];
    modality_id?: number[];
  };
};

export default function StructureForm({ onSubmit, initialData = {} }: StructureFormProps) {
  const [name, setName] = useState(initialData.name || '');
  const [description, setDescription] = useState(initialData.description || '');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nome"
      />
      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Descrição"
        multiline
      />
      <Button title="Salvar" onPress={() => onSubmit({ name, description })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  label: { fontWeight: 'bold', marginTop: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 4, marginBottom: 12 },
});

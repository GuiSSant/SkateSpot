import { useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { Text, View, Button } from 'react-native';
import { getModality, deleteModality } from '@/lib/api';

type Modality = {
  id: number;
  name: string;
  description: string;
};

export default function ModalityDetail() {
  const { id } = useLocalSearchParams();
  const [modality, setModality] = useState<Modality | null>(null);

  useEffect(() => {
    if (id) {
      getModality(Number(id)).then((res) => setModality(res.data));
    }
  }, [id]);

  const handleDelete = async () => {
    await deleteModality(Number(id));
    router.push({ pathname: '/Modalities' });
  };

  if (!modality) return <Text>Carregando...</Text>;

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 24 }}>{modality.name}</Text>
      <Text style={{ marginVertical: 8 }}>{modality.description}</Text>
      <Button
        title="Editar"
        onPress={() => router.push({ pathname: '/modalities/edit', params: { id } })}
      />
      <View style={{ marginTop: 8 }}>
        <Button title="Excluir" color="red" onPress={handleDelete} />
      </View>
    </View>
  );
}

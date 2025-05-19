import { useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, Button } from 'react-native';
import { getStructure, deleteStructure } from '@/lib/api';

export default function StructureDetail() {
  const { id } = useLocalSearchParams();
  const [structure, setStructure] = useState<any>(null);

  useEffect(() => {
    if (id) getStructure(Number(id)).then((res) => setStructure(res.data));
  }, [id]);

  const handleDelete = async () => {
    await deleteStructure(Number(id));
    router.push('/structures');
  };

  if (!structure) return <Text>Carregando...</Text>;

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 24 }}>{structure.name}</Text>
      <Text>{structure.description}</Text>
      <Button title="Editar" onPress={() => router.push({ pathname: '/structures/edit', params: { id } })} />
      <View style={{ marginTop: 8 }}>
        <Button title="Excluir" color="red" onPress={handleDelete} />
      </View>
    </View>
  );
}

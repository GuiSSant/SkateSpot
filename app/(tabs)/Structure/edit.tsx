import { useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { Text } from 'react-native';
import StructureForm from '@/app/(tabs)/FormCadastros/StructureForm';
import { getStructure, updateStructure } from '@/lib/api';

export default function EditStructure() {
  const { id } = useLocalSearchParams();
  const [structure, setStructure] = useState(null);

  useEffect(() => {
    if (id) getStructure(Number(id)).then((res) => setStructure(res.data));
  }, [id]);

  const handleSubmit = async (data: any) => {
    await updateStructure(Number(id), data);
    router.push({ pathname: '/Structure/detail', params: { id } });
  };

  if (!structure) return <Text>Carregando...</Text>;

  return <StructureForm initialData={structure} onSubmit={handleSubmit} />;
}

import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import ModalityForm from '@/app/(tabs)/FormCadastros/ModalityForm';
import { getModality, updateModality } from '@/lib/api';

export default function EditModality() {
  const { id } = useLocalSearchParams();
  const [modality, setModality] = useState<{ name?: string; description?: string } | null>(null);

  useEffect(() => {
    if (id) {
      getModality(Number(id)).then((res) => setModality(res.data));
    }
  }, [id]);

  const handleSubmit = async (data: { name: string; description?: string }) => {
    await updateModality(Number(id), data);
    router.push({ pathname: '/modalities/detail', params: { id } });
  };

  if (!modality) return <Text>Carregando...</Text>;

  return <ModalityForm initialData={modality} onSubmit={handleSubmit} />;
}

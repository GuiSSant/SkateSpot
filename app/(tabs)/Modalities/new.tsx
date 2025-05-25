import { router } from 'expo-router';
import ModalityForm from '@/app/(tabs)/FormCadastros/ModalityForm';
import { createModality } from '@/lib/api'; 

export default function CreateModality() {
  const handleSubmit = async (data: { name: string; description?: string }) => {
    await createModality(data);
    router.push('/Modalities');
  };

  return <ModalityForm onSubmit={handleSubmit} />;
}

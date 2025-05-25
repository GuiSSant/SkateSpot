// /structures/new.tsx
import { router } from 'expo-router';
import StructureForm from '@/app/(tabs)/FormCadastros/StructureForm';
import { createStructure } from '@/lib/api';

export default function CreateStructure() {
  const handleSubmit = async (data: any) => {
    await createStructure(data);
    router.push('/structures');
  };

  return <StructureForm onSubmit={handleSubmit} />;
}

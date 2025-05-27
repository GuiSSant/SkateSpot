// /structures/new.tsx
import { router } from 'expo-router';
import StructureForm from '@/app/(tabs)/FormCadastros/StructureForm';
import { createStructure } from '@/lib/api';

export default function CreateStructure() {
  const handleSubmit = async (data: any) => {
    await createStructure(data);
    alert('Submitting structure data:' + JSON.stringify(data));
    router.push('/Structure');
  };

  return <StructureForm onSubmit={handleSubmit} />;
}

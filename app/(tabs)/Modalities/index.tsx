import { useEffect, useState } from 'react';
import { View, FlatList, Text, Pressable, Button } from 'react-native';
import { router } from 'expo-router';
import { getModalities } from '@/lib/api'; 
import { ButtonMain } from '@/components/common/ButtonMain';

type Modality = {
  id: number;
  name: string;
};

export default function ModalitiesList() {
  const [modalities, setModalities] = useState<Modality[]>([]);

  useEffect(() => {
    getModalities().then((res) => setModalities(res.data)); 
  }, []);

  return (
    <View style={{ padding: 16 }}>
      <ButtonMain title="Nova Modalidade" onPress={() => router.push('/Modalities/new')} />
      <FlatList
        data={modalities}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={{
              padding: 8,
              borderBottomWidth: 1,
              borderBottomColor: '#D1D5DB',
            }}
            onPress={() =>
              router.push({ pathname: '/Modalities/detail', params: { id: item.id } })
            }
          >
            <Text style={{ fontSize: 20 }}>{item.name}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

import { useEffect, useState } from 'react';
import { View, FlatList, Text, Pressable, Button } from 'react-native';
import { router } from 'expo-router';
import { getModalities } from '@/lib/api'; 

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
      <Button title="Nova Modalidade" onPress={() => router.push('/modalities/new')} />
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
              router.push({ pathname: '/modalities/detail', params: { id: item.id } })
            }
          >
            <Text style={{ fontSize: 20 }}>{item.name}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

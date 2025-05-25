import { useEffect, useState } from 'react';
import { View, Text, Pressable, FlatList, Button } from 'react-native';
import { getStructures } from '@/lib/api';
import { router } from 'expo-router';
import { ButtonMain } from '@/components/common/ButtonMain';

type Structure = {
  id: number;
  name: string;
};

export default function StructureList() {
  const [structures, setStructures] = useState<Structure[]>([]);

  useEffect(() => {
    getStructures().then((res) => setStructures(res.data));
  }, []);

  return (
    <View style={{ padding: 16 }}>
      <ButtonMain title="Nova Estrutura" onPress={() => router.push({ pathname: '/Structure/new' })} />
      <FlatList
        data={structures}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push({ pathname: '/Structure/detail', params: { id: item.id } })}
            style={{ padding: 8, borderBottomWidth: 1, borderBottomColor: '#ccc' }}
          >
            <Text style={{ fontSize: 20 }}>{item.name}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

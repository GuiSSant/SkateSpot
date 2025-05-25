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
    router.push('/Structure');
  };

  if (!structure) return <Text>Carregando...</Text>;

  return (
    <GestureHandlerRootView>
            <ScrollView>

    <Text style={styles.titulo}>Estrutura</Text>
      <Text style={{ fontSize: 24 }}>{structure.name}</Text>
      <Text>{structure.description}</Text>
      <Button title="Editar" onPress={() => router.push({ pathname: '/Structure/edit', params: { id } })} />
      <View style={{ marginTop: 8 }}>
        <Button title="Excluir" color="red" onPress={handleDelete} />
    </View>
    </ScrollView>

        </GestureHandlerRootView>

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#0C0A14",
    paddingHorizontal: 16,
  },
  titulo: {
    color: "#fff",
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
    lineHeight: 27.5,
    letterSpacing: 0.11,
    textAlign: "center",
    marginTop: 180,
    marginBottom: 12
  },
  infoText: {
    color: "#fff",
    fontFamily: "Quicksand-Regular",
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 17.5,
    letterSpacing: 0.11,
    textAlign: "center",
    marginHorizontal: 28,
    marginVertical: 12
  },
  loginButton: {
    paddingHorizontal: 42,
    paddingVertical: 8,
    position: "relative",
    bottom: -84,
  },
  formRegister: {
    width: "100%",
  }
});
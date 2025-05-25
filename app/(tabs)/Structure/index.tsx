import { useEffect, useState } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { getStructures } from '@/lib/api';
import { router } from 'expo-router';
import { ButtonMain } from '@/components/common/ButtonMain';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ScrollView } from 'react-native-gesture-handler';
import MainHeader from "@/components/common/MainHeader";


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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
        <MainHeader />

          <Text style={styles.title}>Estruturas</Text>
          <Text style={styles.subtitle}>
            Gerencie ou crie novas estruturas
          </Text>

          <ButtonMain 
            title="Nova Estrutura" 
            onPress={() => router.push({ pathname: '/Structure/new' })}
            style={styles.newButton} 
          />

          <FlatList
            data={structures}
            scrollEnabled={false}
            contentContainerStyle={styles.listContainer}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => router.push({ pathname: '/Structure/detail', params: { id: item.id } })}
                style={({ pressed }) => [
                  styles.structureItem,
                  { opacity: pressed ? 0.6 : 1 }
                ]}
              >
                <Text style={styles.structureName}>{item.name}</Text>
                <Text style={styles.detailText}>Ver detalhes →</Text>
              </Pressable>
            )}
          />
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#0C0A14",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  title: {
    color: "#fff",
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
    lineHeight: 27.5,
    letterSpacing: 0.11,
    marginTop: 180,
    marginBottom: 12
  },
  subtitle: {
    color: "#fff",
    fontFamily: "Quicksand-Regular",
    fontSize: 14,
    lineHeight: 17.5,
    letterSpacing: 0.11,
    textAlign: "center",
    marginHorizontal: 28,
    marginBottom: 32
  },
  newButton: {
    width: '100%',
    marginBottom: 24,
  },
  listContainer: {
    width: '100%',
  },
  structureItem: {
    backgroundColor: '#1E1B2B',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  structureName: {
    color: "#fff",
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    flex: 1,
  },
  detailText: {
    color: "#9747FF",
    fontFamily: "Quicksand-Regular",
    fontSize: 14,
    marginLeft: 16,
  }
});
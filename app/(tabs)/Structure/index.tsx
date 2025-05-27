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
            title="Nova" 
            onPress={() => router.push({ pathname: '/Structure/new' })}
            style={styles.nova} 
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
                <Text style={styles.details}>+</Text>
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
    marginTop: 80,
    marginBottom: 12
  },
    text: {
  color: '#fff',
    fontFamily: 'Quicksand-Bold',
    fontSize: 18,
    lineHeight: 17.5,
    letterSpacing: 0.11,
    textAlign: 'center',
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
  nova: {
    width: '40%',
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
  details: {
    color: "#9747FF",
    fontSize: 18,
    lineHeight: 17.5,
    letterSpacing: 0.11,
    fontFamily: "Quicksand-Bold",
    marginLeft: 16,
  }
});
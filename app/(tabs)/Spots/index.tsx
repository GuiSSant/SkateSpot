import { useEffect, useState } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet, Image } from 'react-native';
import { getSpots } from '@/lib/api';
import { router } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MainHeader from "@/components/common/MainHeader";
import api from "@/lib/api";

const API_URL = api.defaults.baseURL || "http://";

type Spots = {
  id: number;
  name: string;
  distance?: number; 
  main_image: string;
};

export default function Spots() {
  const [spots, setSpots] = useState<Spots[]>([]);


  useEffect(() => {
    getSpots().then((res) => {
      setSpots(res.data || []);  
    })
  }, []);

  const renderSpotItem = ({ item }: { item: Spots }) => {
    return (
      <Pressable
        onPress={() => router.push({ pathname: '/(tabs)/Spots/detail', params: { id: item.id } })}
        style={({ pressed }) => [
          styles.spotCard,
          { opacity: pressed ? 0.6 : 1 }
        ]}
      >
          <Image
            source={{ uri: `${API_URL}${item.main_image}` }}            
            style={styles.spotImage}
            resizeMode="cover"
          />
        <View style={styles.spotInfoContainer}>
          <Text style={styles.spotName}>{item.name || "Sem nome"}</Text>
          <Text style={styles.subtitle}>{item.distance || "Sem distância"}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <FlatList
          data={spots}
          contentContainerStyle={styles.listContainer}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderSpotItem}
          ListHeaderComponent={
            <>
              <MainHeader />
              <Text style={styles.title}>Pistas</Text>
            </>
          }
          ListEmptyComponent={
            <Text style={styles.subtitle}>Nenhuma pista encontrada</Text>
          }
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#0C0A14",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  title: {
    color: "#F5D907",
    textAlign: "center",
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
    lineHeight: 27.5,
    letterSpacing: 0.11,
    marginTop: 80,
    marginBottom: 12
  },
  subtitle: {
    color: "#fff",
    fontFamily: "Quicksand-Regular",
    fontSize: 10,
    lineHeight: 17.5,
    letterSpacing: 0.11,
    textAlign: "right",
    marginHorizontal: 28,
    marginTop: 10,
    marginBottom: 10
  },
  listContainer: {
    width: '100%',
  },
  spotCard: {
    backgroundColor: '#1E1B2B',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    width: "300" 
  },
  spotImage: {
    width: 300,
    height: 150,
    backgroundColor: '#333' 
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#777',
    fontFamily: 'Quicksand-Regular',
    fontSize: 16,
  },
  spotInfoContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  spotName: {
    color: "#fff",
    fontFamily: "Quicksand-Bold",
    textAlign: "center",
    fontSize: 18,
  }
});
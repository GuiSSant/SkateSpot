import { useEffect, useState } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MainHeader from "@/components/common/MainHeader";
import api from "@/lib/api";
import * as Location from "expo-location";
import axios from "axios";


const API_URL = api.defaults.baseURL || "http://";

type Events = {
  id: number;
  name: string;
  distance: number; 
  main_image: string;
};

interface Result {
  id: number;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  main_image: string;
  distance: number;
  description: string;
  images: string;
}

interface Location {
  latitude: number;
  longitude: number;
}

export default function Events() {
  
  const [events, setEvents] = useState<Events[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<Location>({
    latitude: 0,
    longitude: 0,
  });
  const [initialRegion, setInitialRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);


  useEffect(() => {
      requestLocationPermission();
    }, []);

  useEffect(() => {
    if (userLocation.latitude !== 0 && userLocation.longitude !== 0) {
      fetchResults();
    }
  }, [userLocation, filters, searchQuery]);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permissão de localização negada");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    setUserLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  };

  const fetchResults = async () => {
    setLoading(true);
    try {
      const appliedFilters =
        filters.length > 0 ? filters.join(",") : "events";

      const params: any = {
        lat: userLocation.latitude,
        lng: userLocation.longitude,
        types: appliedFilters,
        query: searchQuery,
      };

      const response = await axios.get<Result[]>(`${API_URL}/search/`, { params });
      setResults(response.data);
    } catch (error) {
      console.error("Erro ao buscar resultados:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderEventItem = ({ item }: { item: Events }) => {
    return (
      <Pressable
        onPress={() => router.push({ pathname: '/(tabs)/Events/detail', params: { id: item.id } })}
        style={({ pressed }) => [
          styles.eventCard,
          { opacity: pressed ? 0.6 : 1 }
        ]}
        >
          <Image
            source={{ uri: `${API_URL}${item.main_image}` }}
            style={styles.eventImage}
            resizeMode="cover"
          />
        <View style={styles.eventInfoContainer}>
          <Text style={styles.eventName}>{item.name || "Sem nome"}</Text>
          <Text style={styles.subtitle}>{item.distance.toFixed(2) || "?"} km</Text>
        </View>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F5D907" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <FlatList
          data={results}
          contentContainerStyle={styles.listContainer}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderEventItem}
          ListHeaderComponent={
            <>
              <MainHeader />
              <Text style={styles.title}>Eventos</Text>
            </>
          }
          ListEmptyComponent={
            !loading && (
              <Text style={styles.subtitle}>Nenhum evento encontrado</Text>
            )
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
  eventCard: {
    backgroundColor: '#1E1B2B',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    width: 300
  },
  eventImage: {
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
  eventInfoContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  eventName: {
    color: "#fff",
    fontFamily: "Quicksand-Bold",
    textAlign: "center",
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0C0A14",
  },
});
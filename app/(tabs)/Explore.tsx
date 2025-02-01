import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Keyboard } from 'react-native';


const API_URL = 'http://192.168.0.6:8000';

interface Location {
  latitude: number;
  longitude: number;
}

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


// Tipagem da rota para receber a nova localização
type RootStackParamList = {
  Explore: { newLocation?: Location };
};

type ExploreRouteProp = RouteProp<RootStackParamList, 'Explore'>;

const Explore = () => {
  const navigation = useNavigation();
  const route = useRoute<ExploreRouteProp>();

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<Location>({ latitude: 0, longitude: 0 });
  const [results, setResults] = useState<Result[]>([]);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // Estado para detectar digitação
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const [loaded, error] = useFonts({
          'Quicksand-Bold': require('../../assets/fonts/Quicksand-Bold.ttf'),
          'Quicksand-Regular': require('../../assets/fonts/Quicksand-Regular.ttf'),
      });
      
      
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardOpen(true);
    });
  
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardOpen(false);
    });
  
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    // Atualiza a localização se uma nova for passada como parâmetro
    if (route.params?.newLocation) {
      setUserLocation(route.params.newLocation);
    }
  }, [route.params?.newLocation]);

  
  useEffect(() => {
    if (userLocation.latitude !== 0 && userLocation.longitude !== 0) {
      fetchResults();
    }
  }, [userLocation, filters, searchQuery]);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permissão de localização negada');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    setUserLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  };

  const fetchResults = async () => {
    try {
      const appliedFilters = filters.length > 0 ? filters.join(',') : 'spots,shops,events';
  
      const response = await axios.get<Result[]>(`${API_URL}/search/`, {
        params: {
          lat: userLocation.latitude,
          lng: userLocation.longitude,
          types: appliedFilters,
          query: searchQuery,
        },
      });
      console.log('Response data:', response.data);
      setResults(response.data);
    } catch (error) {
      console.error('Erro ao buscar resultados:', error);
    }
  };

  const toggleFilter = (filter: string) => {
    setFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const handleMapPress = () => {
    setMapExpanded(!mapExpanded);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Pesquisar..."
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          setIsTyping(text.length > 0); // Define isTyping como true se houver texto
        }}
        onBlur={() => setIsTyping(false)} // Quando o usuário sai do campo, volta ao normal
      />

      <ScrollView horizontal style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filters.includes('spots') && styles.activeFilter]}
          onPress={() => toggleFilter('spots')}
        >
          <Text style={styles.filterText}>Pistas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filters.includes('shops') && styles.activeFilter]}
          onPress={() => toggleFilter('shops')}
        >
          <Text style={styles.filterText}>Lojas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filters.includes('events') && styles.activeFilter]}
          onPress={() => toggleFilter('events')}
        >
          <Text style={styles.filterText}>Eventos</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Botão de Localização */}
      <View style={styles.divider} />
        <TouchableOpacity 
          style={styles.locationButton} 
          onPress={() => navigation.navigate('LocationSearch' as never)}
        >
          <Icon name="map-pin" size={20} color="#007bff" />
          <Text style={styles.locationButtonText}>Localização Atual</Text>
        </TouchableOpacity>
      <View style={styles.divider} />

      <View style={styles.containerMap}>
        <Text style={styles.sectionTitle}>Perto de você</Text>

        <View style={{ flex: 1 }}>  
        <FlatList
          horizontal
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('LocalDetails', { id: item.id, name: item.name, type: item.type, latitude: item.latitude, longitude: item.longitude, distance: item.distance, description: item.description, main_image: item.main_image, images: item.images })}>
              <View style={styles.card}>
                <Image source={{ uri: `${API_URL}${item.main_image}` }} style={styles.cardImage} />
                <Text style={styles.cardTitle}>{item.name}</Text>
                <View style={styles.cardDistanceContainer}>
                  <Icon name="map-pin" size={12} color="#666" />
                  <Text style={styles.cardDistance}>{item.distance.toFixed(2)} km</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.horizontalList}
        />
        </View>

        {!isKeyboardOpen && (
          <TouchableOpacity onPress={handleMapPress}>
            <MapView
              style={[
                styles.map, 
                mapExpanded ? styles.mapExpanded : styles.mapCollapsed,
                { flexGrow: 1 } // Permite que o mapa use o espaço restante
              ]}
              initialRegion={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }}
            >
              {results.map((result) => (
                <Marker
                  key={result.id}
                  coordinate={{ latitude: result.latitude, longitude: result.longitude }}
                  title={result.name}
                />
              ))}
            </MapView>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({

  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#fff' 
  },

  searchBar: { 
    height: 45, 
    borderColor: '#ccc', 
    borderWidth: 1, 
    borderRadius: 25, 
    paddingHorizontal: 12, 
    marginBottom: 10 
  },

  filterContainer: { 
    flexDirection: 'row', 
    marginVertical: 10, 
    marginBottom: 15
  },

  filterButton: { 
    paddingVertical: 11, 
    paddingHorizontal: 12, 
    borderRadius: 25, 
    backgroundColor: '#e0e0e0', 
    marginRight: 12, 
    height: 40 
  },
  
  activeFilter: { 
    backgroundColor: '#007bff' 
  },
  
  filterText: { 
    fontSize: 12,
    color: '#000', 
    textAlign: 'center', 
    alignItems: 'center' },
  
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: 'bold',
    marginTop: 20, 
    marginBottom: 8 
  },
  
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Centraliza os itens dentro do botão
    paddingVertical: 10,
    alignSelf: 'center', // Centraliza o botão horizontalmente
  },
  
  locationButtonText: { 
    marginLeft: 8, 
    color: '#007bff', 
    fontSize: 16, 
    alignItems: 'center' 
  },
  
  horizontalList: { 
    paddingBottom: 16 
  },
  
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 2,
    width: '100%', // Define a largura para ocupar quase toda a tela
    alignSelf: 'center', // Centraliza horizontalmente
  },

  card: { 
    width: 100, 
    height: 100, 
    marginRight: 12, 
    marginTop: 8, 
    borderRadius: 15, 
    backgroundColor: '#fff', 
    elevation: 2, 
    padding: 0, 
    alignItems: 'center' 
  },
  
  cardImage: { 
    width: 100, 
    height: 100, 
    borderRadius: 15 
  },
  
  cardTitle: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginTop: 4
  },
  
  cardDistanceContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 2 
  },
  
  cardDistance: { 
    fontSize: 10, color: '#666', 
    marginLeft: 4,
    marginTop: 4 
  },
  
  // Adicionando margem superior ao container
  containerMap: { 
    flex: 500, 
    marginTop: 0 
  }, 
  
  // O mapa ocupará o espaço disponível
  map: { 
    width: '100%',
    height: '100%' 
  }, 
  
  // Altura do mapa quando não expandido
  mapCollapsed: { 
    height: '60%', 
    marginTop: 0 
    
  },

  // Altura do mapa quando expandido
  mapExpanded: { 
    height: '100%' 
  },
});

export default Explore;

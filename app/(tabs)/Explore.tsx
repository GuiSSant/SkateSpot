import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Keyboard } from "react-native";
import DefaultLayout from "./DefaultLayout";
import { customMapStyle } from "../../assets/customMapStyle";
import {resultTeste} from "./Explore/resultTeste"

const API_URL = "http://34.231.200.200:8000";

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

type ExploreRouteProp = RouteProp<RootStackParamList, "Explore">;

const Explore = () => {
  const navigation = useNavigation();
  const route = useRoute<ExploreRouteProp>();

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<Location>({
    latitude: 0,
    longitude: 0,
  });
  const [results, setResults] = useState<Result[]>([]);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // Estado para detectar digitação
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  //CONST de Localização inicial
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [initialRegion, setInitialRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);

  const [loaded, error] = useFonts({
    "Quicksand-Bold": require("../../assets/fonts/Quicksand-Bold.ttf"),
    "Quicksand-Regular": require("../../assets/fonts/Quicksand-Regular.ttf")
  });

  // Estilização do mapa
  const DarkStyleMap = customMapStyle;

  //useEffect localização inicial
  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);

      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    };

    getLocation();
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsKeyboardOpen(true);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardOpen(false);
      },
    );

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
    try {
      const appliedFilters =
        filters.length > 0 ? filters.join(",") : "spots,shops,events";

      const response = await axios.get<Result[]>(`${API_URL}/search/`, {
        params: {
          lat: userLocation.latitude,
          lng: userLocation.longitude,
          types: appliedFilters,
          query: searchQuery,
        },
      });
      console.log("Response data:", response.data);
      setResults(response.data);
    } catch (error) {
      console.error("Erro ao buscar resultados:", error);
    }
  };

  const toggleFilter = (filter: string) => {
    setFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter],
    );
  };

  const handleMapPress = () => {
    setMapExpanded(!mapExpanded);
  };

  return (
    <View style={styles.container}>
      <DefaultLayout {...["explore"]} />

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
          style={[
            styles.filterButton,
            filters.includes("spots") && styles.activeFilter,
          ]}
          onPress={() => toggleFilter("spots")}
        >
          <Text
            style={[
              styles.filterText,
              filters.includes("spots") && styles.activeTextFilter,
            ]}
          >
            Pistas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filters.includes("shops") && styles.activeFilter,
          ]}
          onPress={() => toggleFilter("shops")}
        >
          <Text
            style={[
              styles.filterText,
              filters.includes("shops") && styles.activeTextFilter,
            ]}
          >
            Lojas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filters.includes("events") && styles.activeFilter,
          ]}
          onPress={() => toggleFilter("events")}
        >
          <Text
            style={[
              styles.filterText,
              filters.includes("events") && styles.activeTextFilter,
            ]}
          >
            Eventos
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Botão de Localização */}
      <View style={styles.divider} />
      <TouchableOpacity
        style={styles.locationButton}
        onPress={() => navigation.navigate("LocationSearch" as never)}
      >
        <Icon name="map-pin" size={20} color="#F5D907" />
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
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("LocalDetails", {
                    id: item.id,
                    name: item.name,
                    type: item.type,
                    latitude: item.latitude,
                    longitude: item.longitude,
                    distance: item.distance,
                    description: item.description,
                    main_image: item.main_image,
                    images: item.images,
                  })
                }
              >
                <View style={styles.card}>
                  <Image
                    source={{ uri: `${API_URL}${item.main_image}` }}
                    style={styles.cardImage}
                  />
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <View style={styles.cardDistanceContainer}>
                    <Icon name="map-pin" size={12} color="#666" />
                    <Text style={styles.cardDistance}>
                      {item.distance.toFixed(2)} km
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {!isKeyboardOpen && (
          <View>
            {initialRegion ? (
              <MapView
                showsUserLocation={true}
                showsMyLocationButton={true}
                style={[
                  styles.map,
                  mapExpanded ? styles.mapExpanded : styles.mapCollapsed,
                  { flexGrow: 1 }, // Permite que o mapa use o espaço restante
                ]}
                initialRegion={{
                  latitude: initialRegion?.latitude || 0,
                  longitude: initialRegion?.longitude || 0,
                  latitudeDelta: 0.1,
                  longitudeDelta: 0.1,
                }}
                
                customMapStyle={DarkStyleMap}
              >
                {results.map((result) => (
                  <Marker
                    key={result.id}
                    coordinate={{
                      latitude: result.latitude,
                      longitude: result.longitude,
                    }}
                    title={result.name}
                  
                  >

                    {result.type == 'spot' ? (
                      <Image
                        source={
                          require("../../assets/images/skateRoxo.png")
                        }
                        style={{ width: 30, height: 35 }}
                        resizeMode="contain"
                      />
                    ) : (
                      result.type == 'shop' ? (
                        <Image
                          source={
                            require("../../assets/images/shopRoxo.png")
                          }
                          style={{ width: 30, height: 35 }}
                          resizeMode="contain"
                        />
                      ) : (
                        <Image
                          source={
                            require("../../assets/images/eventoAmarelo.png")
                          }
                          style={{ width: 30, height: 35 }}
                          resizeMode="contain"
                        />

                      )
                    )
                    }


                  </Marker>
                ))}
              </MapView>
            ) : (
              <ActivityIndicator
                size={75}
                color="#F5D907"
                style={{ marginVertical: "50%" }}
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#0C0A14",
  },

  searchBar: {
    backgroundColor: "#fff",
    borderRadius: 8,
    height: 38,
    marginTop: 12,
    paddingHorizontal: 16,
  },

  filterContainer: {
    flexDirection: "row",
    marginVertical: 10,
    marginBottom: 15,
  },

  filterButton: {
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    marginRight: 12,
    height: 32,
  },

  activeFilter: {
    backgroundColor: "#9747FF",
  },

  activeTextFilter: {
    color: "#FFFFFF",
  },

  filterText: {
    fontSize: 12,
    color: "#000",
    textAlign: "center",
    alignItems: "center",
    margin: "auto",
    fontFamily: "Quicksand-Bold",
  },

  sectionTitle: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 8,
    color: "#fff",
    fontFamily: "Quicksand-Bold",
  },

  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Centraliza os itens dentro do botão
    paddingVertical: 10,
    alignSelf: "center", // Centraliza o botão horizontalmente
  },

  locationButtonText: {
    marginLeft: 8,
    color: "#F5D907",
    fontSize: 16,
    alignItems: "center",
    fontFamily: "Quicksand-Bold",
  },

  horizontalList: {
    paddingBottom: 16,
  },

  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 2,
    width: "100%", // Define a largura para ocupar quase toda a tela
    alignSelf: "center", // Centraliza horizontalmente
  },

  card: {
    width: 100,
    height: 100,
    marginRight: 12,
    marginTop: 8,
    borderRadius: 15,
    backgroundColor: "#fff",
    elevation: 2,
    padding: 0,
    alignItems: "center",
  },

  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 15,
  },

  cardTitle: {
    fontSize: 12,
    color: '#fff',
    textAlign: "center",
    marginTop: 4,
    fontFamily: "Quicksand-Bold",

  },

  cardDistanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },

  cardDistance: {
    fontSize: 10,
    color: "#666",
    marginLeft: 4,
    marginTop: 4,
  },

  // Adicionando margem superior ao container
  containerMap: {
    flex: 500,
    marginTop: 0,
  },

  // O mapa ocupará o espaço disponível
  map: {
    width: "100%",
    height: "100%",
  },

  // Altura do mapa quando não expandido
  mapCollapsed: {
    height: "60%",
    marginTop: 0,
  },

  // Altura do mapa quando expandido
  mapExpanded: {
    height: "100%",
  },
});

export default Explore;

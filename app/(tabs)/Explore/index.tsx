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
import { customMapStyle } from "../../../assets/customMapStyle";

import HeaderNavi from "@/components/common/HeaderNavi";
import ModalExplore from "./Modal/modal";
import api from "@/lib/api";
import { router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage'

const API_URL = api.defaults.baseURL || "http:// ";

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

interface filtrosPista {
  modalidade: string[];
  estrutura: string[];
}

type RootStackParamList = {
  Explore: { newLocation?: Location };
};

type ExploreRouteProp = RouteProp<RootStackParamList, "Explore">;


export default function Explore() {
  const navigation = useNavigation();
  const route = useRoute<ExploreRouteProp>();

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<string[]>([]);
  const [subfilters, setSubfilters] = useState<filtrosPista>({
    modalidade: [],
    estrutura: []
  });
  const [showSubfilterModal, setShowSubfilterModal] = useState(false);
  const [currentSubfilterType, setCurrentSubfilterType] = useState<'modalidade' | 'estrutura' | null>(null);
  const [userLocation, setUserLocation] = useState<Location>({
    latitude: 0,
    longitude: 0,
  });
  const [results, setResults] = useState<Result[]>([]);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [initialRegion, setInitialRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);

  const [loaded, error] = useFonts({
    "Quicksand-Bold": require("../../../assets/fonts/Quicksand-Bold.ttf"),
    "Quicksand-Regular": require("../../../assets/fonts/Quicksand-Regular.ttf")
  });

  const DarkStyleMap = customMapStyle;

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permissão para acessar localização negada");
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

  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken"); // ou onde você armazenou
        console.log("TOKEN:", token);
        const response = await axios.get(`${API_URL}/api/auth/user/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        console.log("Dados do usuário:", response.data);
        if (response.data.profile_picture) {
          setProfilePictureUrl(`${response.data.profile_picture}`);
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (route.params?.newLocation) {
      setUserLocation(route.params.newLocation);
    }
  }, [route.params?.newLocation]);

  useEffect(() => {
    if (userLocation.latitude !== 0 && userLocation.longitude !== 0) {
      fetchResults();
    }
  }, [userLocation, filters, searchQuery, subfilters]);

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

      const params: any = {
        lat: userLocation.latitude,
        lng: userLocation.longitude,
        types: appliedFilters,
        query: searchQuery,
      };

      if (filters.includes("spots")) {
        if (subfilters.modalidade.length > 0) {
          params.modalidade = subfilters.modalidade.join(",");
        }
        if (subfilters.estrutura.length > 0) {
          params.estrutura = subfilters.estrutura.join(",");
        }
      }

      const response = await axios.get<Result[]>(`${API_URL}/search/`, { params });
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
  <HeaderNavi />

  <TextInput
    style={styles.searchBar}
    placeholder="Pesquisar..."
    value={searchQuery}
    onChangeText={(text) => {
      setSearchQuery(text);
      setIsTyping(text.length > 0);
    }}
    onBlur={() => setIsTyping(false)}
  />

  <View style={styles.filterContainer}>
    <ScrollView horizontal contentContainerStyle={styles.subfilterContent}  >
      <TouchableOpacity
        style={[
          styles.filterButton,
          filters.includes("spots") && styles.activeFilter,
        ]}
        onPress={() => toggleFilter("spots")}
      >
        <Text style={[styles.filterText, filters.includes("spots") && styles.activeTextFilter]}>
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
        <Text style={[styles.filterText, filters.includes("shops") && styles.activeTextFilter]}>
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
        <Text style={[styles.filterText, filters.includes("events") && styles.activeTextFilter]}>
          Eventos
        </Text>
      </TouchableOpacity>
    </ScrollView>

    {filters.includes("spots") && (
      <ScrollView horizontal style={styles.subfilterScroll} >
        <TouchableOpacity
          style={styles.subfilterButton}
          onPress={() => {
            setCurrentSubfilterType("modalidade");
            setShowSubfilterModal(true);
          }}
        >
          <Text style={styles.subfilterText}>Modalidade</Text>
          {subfilters.modalidade.length > 0 && (
            <View style={styles.subfilterBadge}>
              <Text style={styles.subfilterBadgeText}>{subfilters.modalidade.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.subfilterButton}
          onPress={() => {
            setCurrentSubfilterType("estrutura");
            setShowSubfilterModal(true);
          }}
        >
          <Text style={styles.subfilterText}>Estrutura</Text>
          {subfilters.estrutura.length > 0 && (
            <View style={styles.subfilterBadge}>
              <Text style={styles.subfilterBadgeText}>{subfilters.estrutura.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>
    )}
  </View> 

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
    <FlatList
      horizontal
      data={results}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/(tabs)/Explore/LocalDetails",
              params: {
                id: item.id,
                name: item.name,
                type: item.type,
                latitude: item.latitude,
                longitude: item.longitude,
                distance: item.distance,
                description: item.description,
                main_image: item.main_image,
                images: JSON.stringify(item.images),
              },
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
              <Text style={styles.cardDistance}>{item.distance.toFixed(2)} km</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.horizontalList}
    />

    {!isKeyboardOpen && (
      <View>
        {initialRegion ? (
          <MapView
            showsUserLocation={true}
            showsMyLocationButton={true}
            style={[
              styles.map,
              mapExpanded ? styles.mapExpanded : styles.mapCollapsed,
              { flexGrow: 1 },
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
                {result.type == "spot" ? (
                  <Image
                    source={require("../../../assets/images/skateRoxo.png")}
                    style={{ width: 30, height: 35 }}
                    resizeMode="contain"
                  />
                ) : result.type == "shop" ? (
                  <Image
                    source={require("../../../assets/images/shopRoxo.png")}
                    style={{ width: 30, height: 35 }}
                    resizeMode="contain"
                  />
                ) : (
                  <Image
                    source={require("../../../assets/images/eventoAmarelo.png")}
                    style={{ width: 30, height: 35 }}
                    resizeMode="contain"
                  />
                )}
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

  <ModalExplore
    visible={showSubfilterModal}
    type={currentSubfilterType}
    onClose={() => setShowSubfilterModal(false)}
    onSelect={(option: string) => {
      if (currentSubfilterType) {
        setSubfilters((prev) => ({
          ...prev,
          [currentSubfilterType]: prev[currentSubfilterType].includes(option)
            ? prev[currentSubfilterType].filter((item) => item !== option)
            : [...prev[currentSubfilterType], option],
        }));
      }
    }}
    selectedFilters={currentSubfilterType ? subfilters[currentSubfilterType] : []}
  />
</View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,    
    backgroundColor: "#0C0A14",
  },
  subfilterScroll: {
    marginTop: 10,
    marginLeft: 15 
  },
  subfilterContent: {
    paddingHorizontal: 16,
  },
  searchBar: {
    backgroundColor: "#fff",
    borderRadius: 8,
    height: 38,
    marginTop: 80,
    paddingHorizontal: 16,
  },
  filterContainer: {
    flexDirection: "column",
    marginVertical: 10,
    marginBottom: 15,
    marginTop: 20,

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
  subfilterButton: {
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#333",
    marginRight: 12,
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
  },
  subfilterText: {
    fontSize: 12,
    color: "#fff",
    fontFamily: "Quicksand-Bold",
  },
  subfilterBadge: {
    backgroundColor: '#F5D907',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  subfilterBadgeText: {
    fontSize: 10,
    color: '#000',
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
    justifyContent: "center",
    paddingVertical: 10,
    alignSelf: "center",
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
    width: "100%",
    alignSelf: "center",
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
  containerMap: {
    flex: 500,
    marginTop: 0,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  mapCollapsed: {
    height: "60%",
    marginTop: 0,
  },
  mapExpanded: {
    height: "100%",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
  },
  modalTitle: {
    color: '#F5D907',
    fontSize: 18,
    fontFamily: "Quicksand-Bold",
    marginBottom: 15,
    textAlign: 'center',
  },
  modalOptions: {
    paddingBottom: 15,
  },
  modalOption: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#333',
  },
  modalOptionSelected: {
    backgroundColor: '#9747FF',
  },
  modalOptionText: {
    color: '#fff',
    fontFamily: "Quicksand-Regular",
    textAlign: 'center',
  },
  modalCloseButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  modalCloseText: {
    color: '#F5D907',
    textAlign: 'center',
    fontFamily: "Quicksand-Bold",
  },
});
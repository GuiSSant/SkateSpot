import React, { useState, useRef, useEffect } from "react";
import MapView, {
  Callout,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";
import { StyleSheet, View, Text, Dimensions, Alert, Image } from "react-native";
import { marks } from "../../../assets/marks";
import * as Location from "expo-location";
import { customMapStyle } from "../../../assets/customMapStyle";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

function Home() {
  const mapRef = useRef<MapView>(null);
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [initialRegion, setInitialRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);

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

  console.log("Dentro do primeiro use effect: ", initialRegion);

  const INITIAL_REGION = {
    latitude: initialRegion?.latitude || 0,
    longitude: initialRegion?.longitude || 0,
    latitudeDelta: 0.001, // Mais próximo
    longitudeDelta: 0.001, // Mais próximo
  };

  useEffect(() => {
    // Tenta animar a câmera até que initialRegion esteja definido
    const interval = setInterval(() => {
      if (initialRegion && mapRef.current) {
        console.log("Dentro do if: ", initialRegion);

        mapRef.current.animateCamera(
          {
            pitch: 35, // Inclinação dinâmica
            heading: 0,
            altitude: 500,
            center: {
              latitude: initialRegion.latitude,
              longitude: initialRegion.longitude,
            },
            zoom: 19,
          },
          { duration: 1000 },
        );
        clearInterval(interval); // Limpa o intervalo após sucesso
      }
    }, 500); // Tenta a cada 500ms

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
  }, [initialRegion]);

  const onMarkSelect = (markname: string) => {
    Alert.alert(markname);
  };

  const DarkStyleMap = customMapStyle;

  if (initialRegion) {
    return (
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={INITIAL_REGION}
          showsUserLocation={true}
          showsMyLocationButton={true}
          customMapStyle={DarkStyleMap}
        >
          {marks.map((mark, index) => (
            <Marker
              key={index}
              coordinate={mark}
              onPress={() => onMarkSelect(mark.name)}
              title={mark.name}
            >
              <Image
                source={require("../../../assets/images/markerImagem.png")}
                style={{ width: 30, height: 35 }}
                resizeMode="contain"
              />
            </Marker>
          ))}
        </MapView>

        <View style={styles.textContainer}>
          <Text>TESTE SKATEEEEEEEEEEEEEEEEEEEEEEEEEE</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textContainer: {
    flex: 1,
    height: "7%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute", // Coloca o texto sobre o mapa
    top: 0, // Ajusta a distância do topo
    backgroundColor: "#ffffff",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default Home;

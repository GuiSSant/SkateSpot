import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios from "axios"; // Não se esqueça de importar o axios
import { RootStackParamList } from "./_layout"; // Ajuste o caminho conforme necessário
import DefaultLayout from "./DefaultLayout";
import { useFonts } from "expo-font";

// Defina a interface para a resposta da API
interface NominatimResponse {
  lat: string;
  lon: string;
  display_name: string;
  // Você pode adicionar outros campos que precisar
}

type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "LocationSearch"
>;

const LocationSearch = () => {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigation<NavigationProps>();

  const handleSelectLocation = async () => {
    if (!query) {
      setError("Por favor, insira uma localização.");
      return;
    }

    try {
      // Chamando a API de geocodificação do Nominatim
      const response = await axios.get<NominatimResponse[]>(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            q: query,
            format: "json",
            limit: 1,
          },
          headers: {
            "User-Agent": "SkateSpot/0.0.1", // Altere para o nome do seu aplicativo e versão
          },
        },
      );

      // Verificando se encontramos resultados
      if (response.data.length > 0) {
        const location = response.data[0];
        const newLocation = {
          latitude: parseFloat(location.lat),
          longitude: parseFloat(location.lon),
        };
        navigation.navigate("Explore", { newLocation });
      } else {
        setError("Localização não encontrada.");
      }
    } catch (error) {
      console.error("Erro ao buscar localização:", error);
      setError("Ocorreu um erro ao buscar a localização.");
    }
  };

  const [loaded, fontError] = useFonts({
    "Quicksand-Bold": require("../../assets/fonts/Quicksand-Bold.ttf"),
    "Quicksand-Regular": require("../../assets/fonts/Quicksand-Regular.ttf"),
  });

  return (
    <View style={styles.container}>
      <DefaultLayout {...["explore"]}/>

      <TextInput
        style={styles.searchBar}
        placeholder="Digite a localização..."
        value={query}
        onChangeText={setQuery}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity
        style={styles.selectButton}
        onPress={handleSelectLocation}
      >
        <Text style={styles.selectButtonText}>Selecionar Localização</Text>
      </TouchableOpacity>
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
    height: 38,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 12,
    paddingHorizontal: 16,
  },
  selectButton: {
    marginTop: 20,
    padding: 10,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#9747FF",
  },
  selectButtonText: {
    fontSize: 12,
    color: "#FFF",
    textAlign: "center",
    alignItems: "center",
    margin: "auto",
    fontFamily: "Quicksand-Bold",
  },
  errorText: {
    color: "red",
    marginVertical: 10,
    fontFamily: "Quicksand-Bold",
  },
});

export default LocationSearch;

import api from "@/lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFonts } from "expo-font";
import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableHighlight,
  ScrollView,
  FlatList,
} from "react-native";

interface CarrosselProps {
  title: string;
  onPress?: () => void;
}



export default function Carrossel({
  title,
  onPress
}: CarrosselProps) {
  const API_URL = api.defaults.baseURL || "http:// ";
  const [favoriteSpots, setFavoriteSpots] = React.useState<any[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const response = await axios.get(`${API_URL}/skate-spots`);
        console.log("Dados da pista:", response.data);

        setFavoriteSpots(Array.isArray(response.data) ? response.data : [response.data]);

      } catch (error) {
        console.log("Erro ao carregar imagem de perfil:", error);
      }

    };

    fetchUserData();
  }, []);

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.textCarrossel}>{title}</Text>
        <FlatList
          data={favoriteSpots}
          horizontal
          contentContainerStyle={{ alignItems: 'center' }}
          renderItem={({ item }) => (
            <View style={styles.pistaContainer}>
              <TouchableHighlight >
                <Image
                  style={styles.pistaImage}
                  source={require("@/assets/images/PARQUE_DA_JUVENTUDE_SANTO_ANDRE.jpg")}
                ></Image>
              </TouchableHighlight>
              <Text style={styles.pistaName}>{item?.name || "Item"}</Text>

            </View>
          )}
          keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        />


      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    marginVertical: 32,
  },
  textCarrossel: {
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
    lineHeight: 35,
    color: "#212121",
  },
  pistaContainer: {
    paddingHorizontal: 8,
  },
  pistaImage: {
    backgroundColor: "#C9C9C9",
    height: 120,
    width: 240,
    borderRadius: 16,
    marginVertical: 8,
  },
  pistaName: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    lineHeight: 20,
    color: "#212121",
    textAlign: "center",
  },
});

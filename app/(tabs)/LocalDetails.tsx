import React from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Dimensions,
  Alert,
  Image,
  Button,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableHighlight,
  ImageBackground,
  ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { RootStackParamList } from "./_layout";
import { RouteProp } from "@react-navigation/native";
import DefaultLayout from "./DefaultLayout";

type LocalDetailsRouteProp = RouteProp<RootStackParamList, "LocalDetails">;

const API_URL = "http://192.168.0.6:8000";

const LocalDetails = () => {
  const route = useRoute<LocalDetailsRouteProp>();
  const {
    name,
    type,
    latitude,
    longitude,
    distance,
    description,
    main_image,
    images,
  } = route.params;

  // Função para renderizar cada card de imagem
  const renderImageCard = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: `${API_URL}${item.image}` }}
        style={styles.cardImage}
      />
    </View>
  );

  return (
    <View style={styles.container}>
    <DefaultLayout {...["explore"]} />     
      <Text style={styles.title}>{name}</Text>
      <Image source={main_image} style={styles.image} />
      <Text style={styles.description}>{description}</Text>

      {/* Seção para os cards de imagens */}
      <View style={styles.container}>
        <FlatList
          data={images}
          renderItem={renderImageCard}
          keyExtractor={(item, index) => index.toString()} // Use index como chave, pois as imagens podem não ter um ID único
          horizontal // Exibe os cards horizontalmente
          showsHorizontalScrollIndicator={false} // Oculta a barra de rolagem
          contentContainerStyle={styles.imageList} // Adiciona espaço ao redor da lista
        />
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
  image: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    marginVertical: 8
  },
  title: {
    fontSize: 28,
    color: "#fff",
    alignSelf: "center",
    marginTop: 66,
    lineHeight: 27.5,
    fontFamily: "Quicksand-Bold",
  },
  description: {
    color: "#fff",
    fontFamily: "Quicksand-Regular",
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 17.5,
    letterSpacing: 0.11,
    textAlign: "center",
    marginHorizontal: 28,
    marginTop: 12,
  },
  imageList: {
    paddingVertical: 10
  },
  card: {
    width: 100,
    height: 100,
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 10,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
});

export default LocalDetails;

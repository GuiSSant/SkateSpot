import { useFonts } from "expo-font";
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  TouchableHighlight,
  FlatList,
} from "react-native";

interface LocalImage {
  id: number;
  image: string;
  main_image: boolean;
  create_date: string;
}

interface MidiaProps {
  imagens: LocalImage[];
}

export default function Midia({ imagens }: MidiaProps) {
  const windowWidth = Dimensions.get("window").width - 32;

  if (!imagens || imagens.length === 0) {
    return <Text style={styles.textMidia}>Nenhuma mídia disponível.</Text>;
  }

  const renderItem = ({ item }: { item: LocalImage }) => (
    <TouchableHighlight style={[styles.midiaImageHandler]}>
      <Image style={[styles.midiaImage]} source={{ uri: item.image }} />
    </TouchableHighlight>
  );

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.textMidia}>Mídia</Text>
        <View style={styles.midiaContainer}>
          <FlatList
            contentContainerStyle={{ alignSelf: "center", gap: 8 }}
            numColumns={3}
            data={imagens}
            scrollEnabled={false}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 32,
  },
  textMidia: {
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
    lineHeight: 35,
    color: "#212121",
  },
  midiaContainer: {
    width: "100%",
  },
  midiaImageHandler: {
    marginHorizontal: 8,
    marginVertical: 8
  },
  midiaImage: {
    backgroundColor: "#C9C9C9",
    borderRadius: 16,
    resizeMode: "cover",
    width: 110,
    height: 110,
  },
});

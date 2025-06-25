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
  onImagePress?: (index: number) => void;
  imagens: LocalImage[];
}

export default function Midia({ imagens, onImagePress }: MidiaProps) {
  const windowWidth = Dimensions.get("window").width - 32;

  if (!imagens || imagens.length === 0) {
    return <Text style={styles.textMidia}>Nenhuma mídia disponível.</Text>;
  }

  const renderItem = ({ item, index }: { item: LocalImage; index: number }) => (
    <TouchableHighlight style={[styles.midiaImageHandler]} onPress={() => onImagePress && onImagePress(index)}>
      <Image style={[styles.midiaImage]} source={{ uri: item.image }} />
    </TouchableHighlight>
  );

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.textMidia}>Mídia</Text>
        <View style={styles.midiaContainer}>
          <FlatList
            contentContainerStyle={{ gap: 8 }}
            numColumns={3}
            data={imagens}
            scrollEnabled={false}
            columnWrapperStyle={{ justifyContent: "space-between" }}
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
    color: "#FFF",
  },
  midiaContainer: {
    width: "100%",
  },
  midiaImageHandler: {
    
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
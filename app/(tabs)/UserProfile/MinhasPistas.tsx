import { useFonts } from "expo-font";
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Alert,
  Image,
  Button,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableHighlight,
  ImageBackground,
} from "react-native";

export default function MinhasPistas() {
  const [loaded, error] = useFonts({
    "Quicksand-Bold": require("../../../assets/fonts/Quicksand-Bold.ttf"),
    "Quicksand-Regular": require("../../../assets/fonts/Quicksand-Regular.ttf"),
  });

  if (loaded)
    return (
      <>
        <View style={styles.container}>
          <Text style={styles.textMinhasPistas}>Minhas Pistas</Text>

          <View style={styles.pistaContainer}>
            <TouchableHighlight style={styles.pistaImageHandler}>
              <Image
                style={styles.pistaImage}
                source={require("../../../assets/images/PARQUE_DA_JUVENTUDE_SANTO_ANDRE.jpg")}
              ></Image>
            </TouchableHighlight>
            <Text style={styles.pistaName}>Parque Juventude</Text>
          </View>
        </View>
      </>
    );
}
const styles = StyleSheet.create({
  container: {
    marginVertical: 32,
  },
  textMinhasPistas: {
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
    lineHeight: 35,
    color: "#212121",
  },
  pistaContainer: {
    width: 240,
  },
  pistaImageHandler: {},
  pistaImage: {
    backgroundColor: "#C9C9C9",
    height: 120,
    width: "100%",
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

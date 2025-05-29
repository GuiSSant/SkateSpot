import { useFonts } from "expo-font";
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableHighlight,
  ScrollView,
} from "react-native";

interface CarrosselProps {
  title: string;
  onPress?: () => void;
}

export default function Carrossel({ 
  title, 
  onPress
}: CarrosselProps) {
    return (
      <>
        <View style={styles.container}>
          <Text style={styles.textCarrossel}>{title}</Text>

          <ScrollView horizontal style={styles.pistaContainer}>
            <View>
              <TouchableHighlight >
                <Image
                  style={styles.pistaImage}
                  source={require("@/assets/images/PARQUE_DA_JUVENTUDE_SANTO_ANDRE.jpg")}
                ></Image>
              </TouchableHighlight>
              <Text style={styles.pistaName}>Parque Juventude</Text>
            </View>
          </ScrollView>
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
    width: '100%',
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

import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Alert,
  Image,
  Button,
  TouchableOpacity,
} from "react-native";
import { useFonts } from "expo-font";
import { onBoardingContent } from "../../../assets/onBoardingContent";
import { router } from "expo-router";

function OnBoarding() {
  const [loaded, error] = useFonts({
    "Warband Stencil Textured": require("../../../assets/fonts/Warband Stencil Textured.otf"),
    "Quicksand-Bold": require("../../../assets/fonts/Quicksand-Bold.ttf"),
  });

  const [count, setCount] = useState(0);
  const onPress = () => {
    if (count < 2) {
      setCount((prevCount) => prevCount + 1);
    } else {
      router.replace("/(tabs)/Login/Login");
    }
  };
  if (loaded) {
    return (
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require("../../../assets/images/logo.png")}
        />
        <Image
          style={styles.backgroundImage}
          source={onBoardingContent[count].image}
          blurRadius={2}
        />

        <Text style={styles.onBoardingText}>
          {onBoardingContent[count].mainText}
        </Text>
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.textButton}>
            {onBoardingContent[count].buttonText}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    height: 109,
    resizeMode: "contain",
    top: -16,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "auto",
    zIndex: -1,
  },
  button: {
    backgroundColor: "#9747FF",
    borderRadius: 8,
    paddingHorizontal: 42,
    paddingVertical: 8,
    position: "absolute",
    bottom: 54,
  },
  textButton: {
    color: "#fff",
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
    lineHeight: 27.5,
    letterSpacing: 0.11,
    textAlign: "center",
  },
  onBoardingText: {
    color: "#F5D907",
    fontFamily: "Warband Stencil Textured",
    fontSize: 38,
    fontWeight: 400,
    lineHeight: 37,
    letterSpacing: 0.11,
    textAlign: "center",
    marginHorizontal: "10%",
  },
});

export default OnBoarding;

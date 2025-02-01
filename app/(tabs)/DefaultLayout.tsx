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
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function DefaultLayout() {
  return (
    <>
      <Image
        style={styles.icon_left}
        source={require("../../assets/images/back.png")}
      />
      <Image
        style={styles.logo}
        source={require("../../assets/images/logo.png")}
      />
      <Image
        style={styles.icon_right}
        source={require("../../assets/images/config.png")}
      />
    </>
  );
}

const styles = StyleSheet.create({
  logo: {
    justifyContent: "center",
    alignItems: "center",
    height: 109,
    position: "absolute",
    resizeMode: "contain",
    top: -32,
    zIndex: 100,
  },
  icon_left: {
    position: "absolute",
    left: 16,
    top: 16,
    height: 20,
    resizeMode: "contain",
    zIndex: 100,
  },
  icon_right: {
    position: "absolute",
    right: 16,
    top: 16,
    height: 20,
    resizeMode: "contain",
    zIndex: 100,
  },
});

import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { Link, router } from "expo-router";

export default function Header() {
  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require("../../assets/images/logo.png")}
      />

      <TouchableOpacity onPress={() => router.back()} style={styles.icon_left}>
        <Image
          source={require("../../assets/images/back.png")}
          style={{
            height: 28,
            resizeMode: "contain",
          }}
        />
      </TouchableOpacity>

      
      <TouchableOpacity onPress={() => router.back()} style={styles.icon_right}>
        <Image
          source={require("../../assets/images/config.png")}
          style={{
            height: 28,
            resizeMode: "contain",
          }}
        />
      </TouchableOpacity>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  logo: {
    alignSelf: "center",
    height: 109,
    resizeMode: "contain",
    position: "absolute",
    top: -18,
    zIndex: 100,
  },
  icon_left: {
    position: "absolute",
    left: 16,
    top: 20,
    zIndex: 100,
  },
  icon_right: {
    display: "none",
    position: "absolute",
    right: 16,
    top: 20,
    height: 28,
    resizeMode: "contain",
    zIndex: 100,
  },
});

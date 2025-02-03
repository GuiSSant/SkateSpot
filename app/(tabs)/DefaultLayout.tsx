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
import { Link, router } from "expo-router";

export default function DefaultLayout(icon: string[]) {
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

      {icon[0] !== "perfil" ? (
        <Link href="./UserProfile/UserProfile" style={styles.icon_right}>
          <Image
            style={styles.icon_right}
            source={require("../../assets/images/Profile.png")}
          />
        </Link>
      ) : (
        <Image
          style={styles.icon_right}
          source={require("../../assets/images/config.png")}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
  },
  logo: {
    justifyContent: "center",
    alignItems: "center",
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
    position: "absolute",
    right: 16,
    top: 20,
    height: 28,
    resizeMode: "contain",
    zIndex: 100,
  },
});

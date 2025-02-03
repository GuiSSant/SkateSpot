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
  ScrollView,
} from "react-native";
import { useFonts } from "expo-font";
import DefaultLayout from "../DefaultLayout";
import MinhasPistas from "./MinhasPistas";
import Midia from "./Midia";

export default function UserProfile() {
  const [loaded, error] = useFonts({
    "Quicksand-Bold": require("../../../assets/fonts/Quicksand-Bold.ttf"),
    "Quicksand-Regular": require("../../../assets/fonts/Quicksand-Regular.ttf"),
  });

  if (loaded)
    return (
      <>
        <ImageBackground
          source={require("../../../assets/images/profileBackgroundImage.jpg")}
          resizeMode="cover"
          style={styles.profileBackgroundImage}
          imageStyle={{ opacity: 0.3 }}
        >
          <ScrollView>
            <View style={styles.container}>
              <DefaultLayout {...["perfil"]} />

              <View style={styles.UserContainer}>
                <TouchableHighlight style={styles.HandlerProfilePicture}>
                  <Image
                    style={styles.HandlerProfilePicture}
                    source={require("../../../assets/images/ProfileImage.png")}
                  />
                </TouchableHighlight>
                <View style={styles.profileContent}>
                  <Text style={styles.nameProfile}>Giovanna Mendes</Text>
                  <MinhasPistas />
                  <Midia />
                </View>
              </View>
            </View>
          </ScrollView>
        </ImageBackground>
      </>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "static",
    height: "100%",
    padding: 16,
  },
  profileBackgroundImage: {
    flex: 1,
    justifyContent: "center",
    height: 350,
    resizeMode: "contain",
    backgroundColor: "#0C0A14",
  },
  UserContainer: {
    marginTop: 160,
    alignItems: "center",
    alignSelf: "center",
    width: "110%",
  },
  HandlerProfilePicture: {
    height: 120,
    width: 120,
    borderRadius: 60,
    zIndex: 1,
  },
  profileContent: {
    backgroundColor: "#fff",
    height: "auto",
    width: "100%",
    alignSelf: "center",
    borderTopStartRadius: 70,
    borderTopEndRadius: 70,
    marginTop: -60,
    paddingHorizontal: 16,
  },
  nameProfile: {
    fontSize: 28,
    color: "#212121",
    alignSelf: "center",
    marginTop: 66,
    lineHeight: 27.5,
    fontFamily: "Quicksand-Bold",
  },
});

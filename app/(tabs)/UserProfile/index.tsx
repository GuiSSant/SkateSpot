import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableHighlight,
  ImageBackground,
  ScrollView,
} from "react-native";
import { useFonts } from "expo-font";
import Carrossel from "../../../components/common/Carrossel";
import Midia from "../../../components/common/Midia";
import MainHeader from "../../../components/common/MainHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import api from "@/lib/api";

const API_URL = api.defaults.baseURL || "http:// ";

export default function UserProfile() {

  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const response = await axios.get(`${API_URL}/api/auth/user/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        console.log("Dados do usuário:", response.data);
        if (response.data.profile_picture) {
          setProfilePictureUrl(`${response.data.profile_picture}`);
        }
        setFirstName(response.data.first_name || "");
        setLastName(response.data.last_name || "");
        setUsername(response.data.username || "");
      } catch (error) {
        console.log("Erro ao carregar imagem de perfil:", error);
      }
    };

    fetchUserData();
  }, []);


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
              <MainHeader/>

              <View style={styles.UserContainer}>
                <TouchableHighlight style={styles.HandlerProfilePicture}>
                  <Image
                    style={styles.HandlerProfilePicture}
                    source={
                      profilePictureUrl
                        ? { uri: profilePictureUrl }
                        : require("../../../assets/images/Profile.png")
                    }
                  />
                </TouchableHighlight>
                <View style={styles.profileContent}>
                  <Text style={styles.nameProfile}>
                    {firstName || "Nome"} {lastName || "Sobrenome"}
                  </Text>
                  <Text style={styles.UsernameTag}>
                    @{username}
                  </Text>
                  <Carrossel title="Minhas Pistas"/>
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
    paddingHorizontal: 16,
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
    UsernameTag: {
    fontSize: 14,
    color: "#888", // cinza claro
    marginTop: 4,
    alignSelf: "center",
  },
});

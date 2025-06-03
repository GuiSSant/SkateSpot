import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, TouchableOpacity, Text, Pressable, Modal } from "react-native";
import { router } from "expo-router";
import api from "@/lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = api.defaults.baseURL || "http:// ";

interface MenuItem {
  name: string;
  route?: string;
  color?: string;
}

export default function HeaderNavi() {

  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);

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
      } catch (error) {
        console.log("Erro ao carregar imagem de perfil:", error);
      }
    };

    fetchUserData();
  }, []);

  const [menuVisible, setMenuVisible] = useState(false);

  const menuItems: MenuItem[] = [
    { name: "ASSINATURA", route: "/Premium", color: "#9747FF" },
    { name: "PISTAS", route: "/Spots" },
    { name: "EVENTOS", route: "/Eventos" },
    { name: "LOJAS", route: "/Shops" },
    { name: "MODALIDADES", route: "/Modalities" },
    { name: "ESTRUTURAS", route: "/Structure" },
  ];

  const handleMenuItemPress = (route?: string) => {
    setMenuVisible(false);
    if (route) {
      router.push(route);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require("../../assets/images/logo.png")}
      />

      <TouchableOpacity 
        onPress={() => setMenuVisible(!menuVisible)} 
        style={styles.menuButton}
      >
        <Image
          source={require("@/assets/images/menu.png")}
          style={styles.menuIcon}
        />
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => router.navigate("/(tabs)/UserProfile")} 
        style={styles.profileButton}
      >
        <Image
          style={styles.profileIcon}
          source={
            profilePictureUrl
              ? { uri: profilePictureUrl }
              : require("@/assets/images/Profile.png")
          }
        />
      </TouchableOpacity>

      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="none"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>MENU</Text>
              <TouchableOpacity 
                onPress={() => setMenuVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            {menuItems.map((item) => (
              <Pressable
                key={item.name}
                style={styles.menuItem}
                onPress={() => handleMenuItemPress(item.route)}
              >
                <Text style={[styles.menuText, item.color ? { color: item.color } : {}]}>{item.name}</Text>
              </Pressable>
            ))}
          </View>
          
          {}
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setMenuVisible(false)}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 80,
    justifyContent: "center",
    backgroundColor: "#0C0A14",
  },
  logo: {
    position: "absolute",
    alignSelf: "center",
    height: 109,
    resizeMode: "contain",
    top: -18,
    zIndex: 100,
  },
  menuButton: {
    position: "absolute",
    left: 16,
    zIndex: 101,
    padding: 10,
  },
  menuIcon: {
    height: 28,
    resizeMode: "contain",
  },
   profileButton: {
    position: "absolute",
    right: 16,
    zIndex: 101,
    padding: 10,
  },
  profileIcon: {
    height: 28,
    width: 28,
    borderRadius: 14,
    resizeMode: "contain",
  },
  modalContainer: {
    flex: 1,
    flexDirection: "row",
  },
  menuContainer: {
    width: "70%",
    height: "100%",
    backgroundColor: "#0C0A14",
    paddingTop: 60,
    paddingHorizontal: 20,
    borderRightWidth: 1,
    borderRightColor: "#262626",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#262626",
  },
  menuTitle: {
    color: "#F5D907",
    fontFamily: "Quicksand-Bold",
    fontSize: 24,
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 30,
    lineHeight: 30,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#262626",
  },
  menuText: {
    color: "#fff",
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
  },
});
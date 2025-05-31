import React, { useState } from "react";
import { StyleSheet, View, Image, TouchableOpacity, Text, Pressable, Modal } from "react-native";
import { router } from "expo-router";

interface MenuItem {
  name: string;
  route?: string;
}

export default function HeaderNavi() {
  const [menuVisible, setMenuVisible] = useState(false);

  const menuItems: MenuItem[] = [
    { name: "PISTAS", route: "/Spots" },
    { name: "EVENTOS", route: "/Eventos" },
    { name: "LOJAS", route: "/Shops" },
    { name: "MODALIDADES", route: "/Modalities" },
    { name: "ESTRUTURAS", route: "/Structure" },
    { name: "SOBRE", route: "/About" },
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
          source={require("@/assets/images/Profile.png")}
          style={styles.profileIcon}
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
                <Text style={styles.menuText}>{item.name}</Text>
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
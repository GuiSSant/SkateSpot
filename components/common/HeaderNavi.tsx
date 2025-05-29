import React, { useState } from "react";
import { StyleSheet, View, Image, TouchableOpacity, Text, Pressable } from "react-native";
import { router } from "expo-router";

interface MenuItem {
  name: string;
}

export default function HeaderNavi() {
  const [menuVisible, setMenuVisible] = useState(false);

  const menuItems: MenuItem[] = [
    { name: "PISTAS"},
    { name: "EVENTOS" },
    { name: "LOJAS"},
    { name: "MODALIDADES"},
    { name: "ESTRUTURA" },
    { name: "SOBRE"},
  ];

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require("../../assets/images/logo.png")}
      />

      <TouchableOpacity 
        onPress={() => setMenuVisible(menuVisible)} 
        style={styles.icon_left}
      >
        <Image
          source={require("../../assets/images/menu.png")}
          style={styles.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.icon_right}>
        <Image
          source={require("../../assets/images/config.png")}
          style={styles.icon}
        />
      </TouchableOpacity>

      {menuVisible && (
        <>
         
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>MENU</Text>
              <TouchableOpacity onPress={() => setMenuVisible(false)}>
                <Text style={styles.closeButton}>×</Text>
              </TouchableOpacity>
            </View>

            {menuItems.map((item) => (
              <Pressable
                key={item.name}
                style={styles.menuItem}
                onPress={() => router.push('/Evento')} 
              >
                <Text style={styles.menuText}>{item.name}</Text>
              </Pressable>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: 'relative',
  },
  logo: {
    alignSelf: "center",
    height: 109,
    resizeMode: "contain",
    position: "absolute",
    top: -18,
    zIndex: 100,
  },
  icon: {
    height: 28,
    resizeMode: "contain",
  },
  icon_left: {
    position: "absolute",
    left: 16,
    top: 20,
    zIndex: 101,
  },
  icon_right: {
    display: "none",
    position: "absolute",
    right: 16,
    top: 20,
    zIndex: 100,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 200,
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '70%',
    height: '100%',
    backgroundColor: '#0C0A14',
    paddingTop: 60,
    paddingHorizontal: 20,
    zIndex: 300,
    borderRightWidth: 1,
    borderRightColor: '#262626',
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
  },
  menuTitle: {
    color: '#F5D907',
    fontFamily: 'Quicksand-Bold',
    fontSize: 24,
  },
  closeButton: {
    color: '#fff',
    fontSize: 30,
    lineHeight: 30,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
  },
  menuText: {
    color: '#fff',
    fontFamily: 'Quicksand-Bold',
    fontSize: 18,
  },
});
import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, ScrollView, Text, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useFonts } from 'expo-font';
import { router } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import MainHeader from "@/components/common/MainHeader";
import { ButtonMain } from "@/components/common/ButtonMain";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Form } from "@/components/common/Form";

const API_URL = "http://34.231.200.200:8000";

export default function Login() {
  const [loaded] = useFonts({
    "Quicksand-Bold": require("@/assets/fonts/Quicksand-Bold.ttf"),
    "Quicksand-Regular": require("@/assets/fonts/Quicksand-Regular.ttf"),
  });

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => { setShowPassword(!showPassword); };


  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login/`, {
        email,
        senha,
      });
      console.log(res);
      await SecureStore.setItemAsync("userToken", res.data.key);
      router.replace("/(tabs)/Explore");
    } catch (error) {
      Alert.alert("Erro", "E-mail ou senha incorretos.");
    }
  };

  if (!loaded) return null;

  return (
    <GestureHandlerRootView>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <MainHeader />
          <Text style={styles.titulo}>Login</Text>
          <Text style={styles.infoText}>
            Encontre os melhores spots, descubra eventos e junte-se à comunidade!
          </Text>

          <View style={styles.formRegister}>
            <Form label="E-mail" keyboardType="email-address" value={email} onChangeText={setEmail} />

            <View style={{ flexDirection: "row", alignItems: "center", position: "relative" }}>
              <Form label="Senha" secureTextEntry={!showPassword} placeholder="********" value={senha} onChangeText={setSenha}  />
              <MaterialCommunityIcons name={showPassword ? "eye-off" : "eye"} size={24} color="#000" onPress={toggleShowPassword} style={{ position: "absolute", right: 16, top: 40}} />
            </View>

            <Text style={[styles.infoText, { alignSelf: "flex-end" }]}>Esqueci a senha</Text>
          </View>

          <View style={{ marginTop: 32 }}>
            <Text style={{ color: '#fff', fontFamily: 'Quicksand-Regular', textAlign: 'center' }}>
              Ainda não possui cadastro?{' '}
              <Text
                onPress={() => router.push('/(tabs)/Cadastro')}
                style={{ color: '#F5D907', fontFamily: 'Quicksand-Bold' }}
              >
                Cadastre-se aqui
              </Text>
            </Text>
          </View>

          <ButtonMain
            title="Entrar"
            onPress={handleLogin}
            style={styles.loginButton}
          />
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#0C0A14",
    paddingHorizontal: 16,
  },
  titulo: {
    color: "#fff",
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
    lineHeight: 27.5,
    letterSpacing: 0.11,
    textAlign: "center",
    marginTop: 180,
    marginBottom: 12
  },
  infoText: {
    color: "#fff",
    fontFamily: "Quicksand-Regular",
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 17.5,
    letterSpacing: 0.11,
    textAlign: "center",
    marginHorizontal: 28,
    marginVertical: 12
  },
  loginButton: {
    paddingHorizontal: 42,
    paddingVertical: 8,
    position: "relative",
    bottom: -84,
  },
  formRegister: {
    width: "100%",
  }
});
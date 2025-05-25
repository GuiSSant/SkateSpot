import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, ScrollView, Text, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useFonts } from 'expo-font';
import { Link, router } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ButtonMain } from '../../../components/common/ButtonMain';
import { ButtonMidiaSocial } from '../../../components/common/ButtonMidiaSocial';
import { Form } from '../../../components/common/Form';

import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const API_URL = "http://192.168.0.6:8000";

function Login() {
  const [loaded] = useFonts({
    "Quicksand-Bold": require("../../../assets/fonts/Quicksand-Bold.ttf"),
    "Quicksand-Regular": require("../../../assets/fonts/Quicksand-Regular.ttf"),
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [requestGoogle, responseGoogle, promptGoogle] = Google.useAuthRequest({
    clientId: 'SEU_CLIENT_ID_GOOGLE.apps.googleusercontent.com',
  });

  const [requestFB, responseFB, promptFB] = Facebook.useAuthRequest({
    clientId: 'SEU_APP_ID_FACEBOOK',
  });

  useEffect(() => {
    if (responseGoogle?.type === "success") {
      const { authentication } = responseGoogle;
      handleOAuthLogin("google", authentication?.accessToken);
    }
    if (responseFB?.type === "success") {
      const { authentication } = responseFB;
      handleOAuthLogin("facebook", authentication?.accessToken);
    }
  }, [responseGoogle, responseFB]);

  const handleOAuthLogin = async (provider: "google" | "facebook", token: string) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/social-login/`, {
        provider,
        token,
      });
      await SecureStore.setItemAsync("userToken", res.data.key);
      router.replace("/(tabs)/Explore");
    } catch (err) {
      Alert.alert("Erro ao autenticar", "Verifique sua conta.");
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login/`, {
        email,
        password,
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
          <Image style={styles.logo} source={require("../../../assets/images/logo.png")} />
          <Text style={styles.titulo}>Login</Text>
          <Text style={styles.infoText}>
            Encontre os melhores spots, descubra eventos e junte-se à comunidade!
          </Text>

          <View style={styles.loginAlternavivesView}>
            <TouchableOpacity style={styles.loginAlternavivesButton} onPress={() => promptGoogle()}>
              <Image style={{ width: 20, height: 20 }} source={require("../../../assets/images/google.png")} />
              <Text> Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginAlternavivesButton} onPress={() => promptFB()}>
              <Image style={{ width: 20, height: 20 }} source={require("../../../assets/images/facebook.png")} />
              <Text> Facebook</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formRegister}>
            <Text style={styles.formFieldTitle}>E-mail</Text>
            <TextInput
              style={styles.formInputText}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />

            <Text style={styles.formFieldTitle}>Senha</Text>
            <TextInput
              secureTextEntry
              style={styles.formInputText}
              placeholder="********"
              value={password}
              onChangeText={setPassword}
            />
            <Text style={[styles.infoText, { alignSelf: "flex-end" }]}>Esqueci a senha</Text>
          </View>

          <View style={{ marginTop: 32 }}>
            <Text style={{ color: '#fff', fontFamily: 'Quicksand-Regular', textAlign: 'center' }}>
              Ainda não possui cadastro?{' '}
              <Text
                onPress={() => router.push('/(tabs)/Cadastro/Cadastro')}
                style={{ color: '#F5D907', fontFamily: 'Quicksand-Bold' }}
              >
                Cadastre-se aqui
              </Text>
            </Text>
          </View>

          <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
            <Text style={styles.textButton}>Entrar</Text>
          </TouchableOpacity>
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
  logo: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    height: 109,
    resizeMode: "contain",
    top: -16,
  },
  titulo: {
    color: "#fff",
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
    lineHeight: 27.5,
    letterSpacing: 0.11,
    textAlign: "center",
    marginTop: 180,
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
    marginTop: 12,
  },
  loginButton: {
    backgroundColor: "#9747FF",
    borderRadius: 8,
    paddingHorizontal: 42,
    paddingVertical: 8,
    position: "relative",
    bottom: -84,
  },
  textButton: {
    color: "#fff",
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
    lineHeight: 27.5,
    letterSpacing: 0.11,
    textAlign: "center",
  },
  loginAlternavivesView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  loginAlternavivesButton: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#262626B2",
    paddingHorizontal: 42,
    paddingVertical: 8,
    marginHorizontal: 14,
  },
  formRegister: {
    width: "100%",
  },
  formFieldTitle: {
    color: "#F5D907",
    fontFamily: "Quicksand-Bold",
    fontSize: 14,
    lineHeight: 17.5,
    letterSpacing: 0.11,
    textAlign: "left",
    marginTop: 24,
    marginHorizontal: 16,
  },
  formInputText: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 12,
    paddingHorizontal: 16,
    height: 36,
  },
});


export default Login;
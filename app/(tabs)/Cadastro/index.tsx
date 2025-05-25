import React, { useState } from 'react';
import { View, Image, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import { router } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ButtonMain } from '../../../components/common/ButtonMain';
import { Form } from '../../../components/common/Form';
import { Alert } from 'react-native';

import axios from 'axios';

import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator } from 'expo-image-manipulator'; // opcional se quiser tratar recorte mais avançado
import MainHeader from '../../../components/common/MainHeader';
import MaterialCommunityIcons from '@expo/vector-icons/build/MaterialCommunityIcons';

const API_URL = "http://34.231.200.200:8000";

function Cadastro() {
  const [loaded] = useFonts({
    "Quicksand-Bold": require("@/assets/fonts/Quicksand-Bold.ttf"),
    "Quicksand-Regular": require("@/assets/fonts/Quicksand-Regular.ttf"),
  });

  //Estados dos campos do formulário
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [emailConfirmacao, setEmailConfirmacao] = useState('');
  const [senhaConfirmacao, setSenhaConfirmacao] = useState('');
  const [imagemPerfil, setImagemPerfil] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {setShowPassword(!showPassword);};
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const toggleShowPasswordConfirm = () => {setShowPasswordConfirm(!showPasswordConfirm);};

  const selecionarImagem = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permissão para acessar a galeria é necessária!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // permite redimensionar
      aspect: [1, 1],       // corte quadrado (ideal para foto circular)
      quality: 1,
    });

    if (!result.canceled) {
      setImagemPerfil(result.assets[0].uri);
    }
  };

  const handleRegister = async () => {
    // Verificações básicas
    if (!nome || !username || !email || !emailConfirmacao || !senha || !senhaConfirmacao) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    if (email !== emailConfirmacao) {
      alert("Os e-mails não coincidem.");
      return;
    }

    if (senha !== senhaConfirmacao) {
      alert("As senhas não coincidem.");
      return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password1', senha);
    formData.append('password2', senha);
    formData.append('first_name', nome);
    formData.append('last_name', sobrenome);

    if (imagemPerfil) {
      const filename = imagemPerfil.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || '');
      const ext = match ? match[1] : 'jpg';

      formData.append('profile_picture', {
        uri: imagemPerfil,
        name: `profile.${ext}`,
        type: `image/${ext}`,
      } as any);
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/registration/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      router.replace('/(tabs)/Login');
    } catch (error: any) {
      console.error('Erro no cadastro:', error?.response?.data || error);
      console.log(error?.response?.data)
      const errorData = error?.response?.data;
      if (errorData && typeof errorData === 'object') {
        const mensagens = Object.values(errorData)
          .flat()
          .map(msg => `- ${msg}`)
          .join('\n');

        Alert.alert('Erro', mensagens); // <<-- Título definido como "Erro"
      } else {
        Alert.alert('Erro', 'Ocorreu um erro desconhecido.');
      }
    }
  };

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={estilo.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={estilo.container}>

          <MainHeader />

          <Text style={estilo.title}>Cadastro</Text>
          <Text style={estilo.subtitle}>
            Encontre os melhores spots, descubra eventos e junte-se a comunidade!
          </Text>

          <TouchableOpacity onPress={selecionarImagem} style={{ marginBottom: 24 }}>
            <Image
              source={
                imagemPerfil
                  ? { uri: imagemPerfil }
                  : require("../../../assets/images/icon.png") // imagem padrão
              }
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                borderWidth: 2,
                borderColor: "#F5D907",
                backgroundColor: "#ccc",
              }}
            />
            <Text style={{ color: '#fff', textAlign: 'center', marginTop: 8 }}>Carregar foto</Text>
          </TouchableOpacity>

          <Form label="Nome" value={nome} onChangeText={setNome} />
          <Form label="Sobrenome" value={sobrenome} onChangeText={setSobrenome} />
          <Form label="Nome de usuário" value={username} onChangeText={setUsername} />

          <Form label="E-mail" keyboardType="email-address" value={email} onChangeText={setEmail} />
          <Form label="Confirmar E-mail" keyboardType="email-address" value={emailConfirmacao} onChangeText={setEmailConfirmacao} />

          <View style={{ flexDirection: "row", alignItems: "center", position: "relative" }}>
            <Form label="Senha" secureTextEntry={!showPassword} placeholder="********" value={senha} onChangeText={setSenha} />
            <MaterialCommunityIcons name={showPassword ? "eye-off" : "eye"} size={24} color="#000" onPress={toggleShowPassword} style={{ position: "absolute", right: 16, top: 40 }} />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", position: "relative" }}>
            <Form label="Confirmar Senha" secureTextEntry={!showPasswordConfirm} placeholder="********" value={senhaConfirmacao} onChangeText={setSenhaConfirmacao} />
            <MaterialCommunityIcons name={showPasswordConfirm ? "eye-off" : "eye"} size={24} color="#000" onPress={toggleShowPasswordConfirm} style={{ position: "absolute", right: 16, top: 40 }} />
          </View>

          <Text style={estilo.tenhoConta} onPress={() => router.push('/(tabs)/Login')}>
            Já tenho conta
          </Text>

          <ButtonMain
            title="Cadastrar"
            onPress={handleRegister}
            style={estilo.registerButton}
          />
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const estilo = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#0C0A14',
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  logo: {
    height: 109,
    resizeMode: 'contain',
    marginTop: 16,
  },
  title: {
    color: '#fff',
    fontFamily: 'Quicksand-Bold',
    fontSize: 22,
    marginTop: 120,
    marginBottom: 12,
  },
  subtitle: {
    color: '#fff',
    fontFamily: 'Quicksand-Regular',
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 28,
    marginBottom: 24,
  },
  buttonsMidiaSocial: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginVertical: 24,
  },
  secaoTitle: {
    color: '#fff',
    fontFamily: 'Quicksand-Regular',
    fontSize: 14,
    alignSelf: 'flex-start',
    marginLeft: 16,
    marginBottom: 16,
  },
  tenhoConta: {
    color: '#fff',
    fontFamily: 'Quicksand-Regular',
    fontSize: 14,
    alignSelf: 'center',
    marginVertical: 16,
  },
  registerButton: {
    marginTop: 16,
  },
});

export default Cadastro;
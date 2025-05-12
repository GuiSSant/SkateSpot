import React from 'react';
import { View, Image, StyleSheet, ScrollView, Text } from 'react-native';
import { useFonts } from 'expo-font';
import { Link, router } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ButtonMain } from '../../../components/common/ButtonMain';
import { ButtonMidiaSocial } from '../../../components/common/ButtonMidiaSocial';
import { Form } from '../../../components/common/Form';

function Cadastro() {
  const [loaded] = useFonts({
    "Quicksand-Bold": require("../../../assets/fonts/Quicksand-Bold.ttf"),
    "Quicksand-Regular": require("../../../assets/fonts/Quicksand-Regular.ttf"),
  });

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={estilo.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={estilo.container}>
          <Image
            style={estilo.logo}
            source={require("../../../assets/images/logo.png")}
          />
          
          <Text style={estilo.title}>Cadastro</Text>
          <Text style={estilo.subtitle}>
            Encontre os melhores spots, descubra eventos e junte-se a comunidade!
          </Text>

          <View style={estilo.buttonsMidiaSocial}>
            <ButtonMidiaSocial
              icon={require("../../../assets/images/google.png")}
              title="Google"
            />
            <ButtonMidiaSocial
              icon={require("../../../assets/images/facebook.png")}
              title="Facebook"
            />
          </View>

          <Text style={estilo.secaoTitle}>Cadastre-se</Text>

          <Form label="Nome" />
          <Form label="E-mail" />
          <Form label="Senha" secureTextEntry placeholder="********" />
          
          <Text style={estilo.tenhoConta}>Já tenho conta</Text>

          <ButtonMain 
            title="Cadastrar" 
            onPress={() => router.push('/UserProfile/UserProfile')}
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
    marginTop: 32,
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
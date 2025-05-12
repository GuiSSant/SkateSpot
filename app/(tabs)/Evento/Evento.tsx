import React from 'react';
import { View, Image, StyleSheet, ScrollView, Text } from 'react-native';
import { useFonts } from 'expo-font';
import { Link, router } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ButtonMain } from '../../../components/common/ButtonMain';
import { Form } from '../../../components/common/Form';

function Evento() {
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
          
          <Text style={estilo.title}>Novo Evento</Text>
          <Text style={estilo.subtitle}>
          Aumente o alcance da sua skateshop e movimente a cena com um novo evento.
          </Text>

          <Form label="Nome do Evento" placeholder='Digite o nome do Evento.' />
          <Form label="Descrição" placeholder='Descreva o evento.'/>
          <Form label="Endereço" placeholder='Pesquise por CEP, rua, bairro...'/>
          <Form label="Modalidade" placeholder='Selecione as modalidades'/>
          <Form label="Patrocinadores" placeholder='Informe os patrocinadores'/>
          <Form label="Imagem" placeholder='Faça upload da imagem que servirá de banner'/>


          <ButtonMain 
            title="Cadastrar" 
            onPress={() => router.push('/UserProfile/')}
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
  secaoTitle: {
    color: '#fff',
    fontFamily: 'Quicksand-Regular',
    fontSize: 14,
    alignSelf: 'flex-start',
    marginLeft: 16,
    marginBottom: 16,
  },
  registerButton: {
    marginTop: 16,
  },
});

export default Evento;
import React from 'react';
import { View, Image, StyleSheet, ScrollView, Text } from 'react-native';
import { useFonts } from 'expo-font';
import { router } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ButtonMain } from '../../../components/common/ButtonMain';
import { Form } from '../../../components/common/Form';
import MainHeader from '../../../components/common/MainHeader';

type NovoEvento = {
  name: string;
  start_date: string;
  end_date: string ;
  create_date:  string;
  location_id: number;

};

function Evento() {
  const [loaded] = useFonts({
    "Quicksand-Bold": require("../../../assets/fonts/Quicksand-Bold.ttf"),
    "Quicksand-Regular": require("../../../assets/fonts/Quicksand-Regular.ttf"),
  });

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
      <View>
        <MainHeader />
          
          <Text style={styles.title}>Novo Evento</Text>
          <Text style={styles.subtitle}>
         Crie um novo evento.
          </Text>

          <Form label="Nome do Evento" placeholder='Digite o nome do Evento.' />
          <Form label="Descrição" placeholder='Descreva o evento.'/>
          <Form label="Local" placeholder='Pesquise por CEP, rua, bairro...'/>
          <Form label="Início" placeholder='informe a data de início'/>


          <ButtonMain 
            title="Cadastrar" 
            onPress={() => router.push('/Explore')}
            
          />
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#0C0A14',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  title: {
    color: '#fff',
    fontFamily: 'Quicksand-Bold',
    fontSize: 22,
    lineHeight: 27.5,
    letterSpacing: 0.11,
    marginTop: 80,
    marginBottom: 12
  },
  subtitle: {
    color: '#fff',
    fontFamily: 'Quicksand-Regular',
    fontSize: 14,
    lineHeight: 17.5,
    letterSpacing: 0.11,
    textAlign: 'center',
    marginHorizontal: 28,
    marginBottom: 32
  },
  submitButton: {
    width: '100%',
    marginTop: 40,
  },
});

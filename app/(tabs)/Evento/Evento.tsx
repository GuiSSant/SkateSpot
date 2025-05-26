import React, {useState} from 'react';
import { View, Image, StyleSheet, ScrollView, Text, Pressable} from 'react-native';
import { useFonts } from 'expo-font';
import { router } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ButtonMain } from '../../../components/common/ButtonMain';
import { Form } from '../../../components/common/Form';

function NovoEvento() {
  const [loaded] = useFonts({
    "Quicksand-Bold": require("../../../assets/fonts/Quicksand-Bold.ttf"),
    "Quicksand-Regular": require("../../../assets/fonts/Quicksand-Regular.ttf"),
  });


  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Image
            style={styles.logo}
            source={require("../../../assets/images/logo.png")}
          />
          
          <Text style={styles.title}>Novo Evento</Text>
          <Text style={styles.subtitle}>
            Aumente o alcance da sua skateshop e movimente a cena com um novo evento.
          </Text>

          <View style={styles.formContainer}>
            <Form 
              label="Nome do Evento" 
              placeholder='Digite o nome do Evento'
              containerStyle={styles.formField}
            />
            
            <Form 
              label="Descrição" 
              placeholder='Descreva o evento'
              multiline
              numberOfLines={4}
              containerStyle={styles.formField}
            />
            
            <Form 
              label="Endereço" 
              placeholder='Pesquise por CEP, rua, bairro...'
              containerStyle={styles.formField}
            />
            
            <View style={styles.dateRow}>
              <View style={styles.dateInput}>
                <Text style={styles.label}>Data de Início</Text>
                
              </View>
              
              <View style={styles.dateInput}>
                <Text style={styles.label}>Data de Término</Text>
          
              </View>
            </View>
            

          <ButtonMain 
            title="Cadastrar" 
            onPress={() => router.push('/(tabs)/UserProfile')}
            style={styles.registerButton}
          />
          </View>
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
    paddingBottom: 32,
  },
  logo: {
    height: 109,
    resizeMode: 'contain',
    marginTop: 16,
    marginBottom: 8,
  },
  title: {
    color: '#fff',
    fontFamily: 'Quicksand-Bold',
    fontSize: 22,
    marginTop: 16,
    marginBottom: 12,
  },
  subtitle: {
    color: '#fff',
    fontFamily: 'Quicksand-Regular',
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 28,
    marginBottom: 32,
    lineHeight: 20,
  },
  formContainer: {
    width: '100%',
    marginBottom: 24,
  },
  formField: {
    marginBottom: 20,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateInput: {
    width: '48%',
  },
  label: {
    color: '#F5D907',
    fontFamily: 'Quicksand-Bold',
    fontSize: 14,
    marginBottom: 8,
  },
  datePickerButton: {
    backgroundColor: '#1E1B2B',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2A2638',
  },
  dateText: {
    color: '#fff',
    fontFamily: 'Quicksand-Regular',
    fontSize: 14,
  },
  registerButton: {
    marginTop: 16,
    width: '100%',
  },
});

export default NovoEvento;
import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Alert,
  Image,
  Button,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from "react-native";
import { useFonts } from "expo-font";
import { onBoardingContent } from "../../../assets/onBoardingContent";
import { Link, router } from "expo-router";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Dropdown } from "react-native-element-dropdown";
import axios from "axios";
import Toast from "react-native-toast-message";

const API_URL = "http://34.231.200.200:8000";


const dropdownLocal = [
  { label: 'Pista', value: '1' },
  { label: 'Skateshop', value: '2' },
  { label: 'Evento', value: '3' },
]

const dropdownSimNao = [
  { label: 'Sim', value: '1' },
  { label: 'Não', value: '2' },
]

const campos = [
  { id: 1, nome: 'CEP', tipo: 'Numeric', editavel: true, visivel: "flex" },
  { id: 2, nome: 'Logradouro', tipo: 'Text', editavel: false, visivel: "flex" },
  { id: 3, nome: 'Número', tipo: 'Numeric', editavel: true, visivel: "flex" },
  { id: 4, nome: 'Bairro', tipo: 'Text', editavel: false, visivel: "flex" },
  { id: 5, nome: 'Cidade', tipo: 'Text', editavel: false, visivel: "flex" },
  { id: 6, nome: 'Estado', tipo: 'Text', editavel: false, visivel: "flex" },
  { id: 7, nome: 'País', tipo: 'Text', editavel: false, visivel: "flex" },
  { id: 8, nome: 'Tipo', tipo: 'Dropdown', editavel: true, visivel: "flex" },
  { id: 9, nome: 'Latitude', tipo: 'Text', editavel: false, visivel: "none" },
  { id: 10, nome: 'Longitude', tipo: 'Text', editavel: false, visivel: "none" }
]

const camposPista = [
  { id: 1, nome: 'Nome', tipo: 'Text', editavel: true, visivel: "flex" },
  { id: 2, nome: 'Descrição', tipo: 'Text', editavel: true, visivel: "flex" },
  { id: 3, nome: 'Luz', tipo: 'Dropdown', editavel: true, visivel: "flex" },
  { id: 4, nome: 'Água', tipo: 'Dropdown', editavel: true, visivel: "flex" },
  { id: 5, nome: 'Banheiro', tipo: 'Dropdown', editavel: true, visivel: "flex" },
  { id: 6, nome: 'DataCriação', tipo: 'Text', editavel: false, visivel: "none" },
  { id: 7, nome: 'location_id', tipo: 'Text', editavel: false, visivel: "none" }
]

let tipoForm = 'TTeste'

function FormCadastros() {

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const [loaded, error] = useFonts({
    "Quicksand-Bold": require("../../../assets/fonts/Quicksand-Bold.ttf"),
    "Quicksand-Regular": require("../../../assets/fonts/Quicksand-Regular.ttf"),
  });

  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  function changeForm(label: string) {
    tipoForm = label
  }


  // Estado para armazenar os valores de cada campo
  const [valores, setValores] = useState({});

  useEffect(() => {
    const cep = valores[1]; // O campo de CEP tem id 1

    const buscarDadosPorCep = async () => {
			setValores((prev) => ({
				...prev,
				2: '', 			// Logradouro
				3: '', 			// Número
				4: '',     	// Bairro
				5: '',     	// Cidade
				6: '',     	// Estado
				7: '',       // País
        9: '',      // Latitude
        10: ''      // Longitude
			}));
      if (cep && cep.length === 8) { // Verifica se o CEP está preenchido (8 dígitos)
        try {
          const response = await axios.get(`${API_URL}/search_address/`, {
						params: {
							cep: cep
						}
					});
          const data = response.data;
					console.log("Data: ", data)
          // Atualiza os campos com os dados recebidos
          setValores((prev) => ({
            ...prev,
            2: data[0]['logradouro'],   // Logradouro
            4: data[0]['bairro'],       // Bairro
            5: data[0]['cidade'],       // Cidade
            6: data[0]['estado'],       // Estado
            7: data[0]['pais'],         // País
            9: data[0]['latitude'],         // Latitude
            10: data[0]['longitude']         // Longitude
          }));
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
					setValores((prev) => ({
            ...prev,
            2: '', 			// Logradouro
            3: '', 			// Número
            4: '',     	// Bairro
            5: '',     	// Cidade
            6: '',     	// Estado
            7: '',      // País
            9: '',      // Latitude
            10: ''      // Longitude
          }));
					Alert.alert("Erro", "Não foi possível buscar o CEP. Tente novamente.");
        }
      }
    };

    buscarDadosPorCep(); // Chama a função para buscar os dados
  }, [valores[1]]); // O efeito é executado sempre que o valor do CEP mudar


  const handleChange = (id, novoValor) => {
    setValores((prev) => ({
      ...prev,
      [id]: novoValor,
    }));
  };

  const registerAddress = async () => {
    try {
      console.log("Local: ", valores)

      const response = await axios.post(`${API_URL}/location/`, {
        'zip_code': valores[1],
        'street': valores[2],
        'number': valores[3],
        'district': valores[4],
        'city': valores[5],
        'state': valores[6],
        'country': valores[7],
        'latitude': valores[9],
        'longitude': valores[10],
      });

    } catch (error) {
      console.error(error)
      Alert.alert("Erro", "Não foi possível cadastrar o local. Tente novamente.");
    }
  };

  if (loaded) {
    return (
      <GestureHandlerRootView>
        <ScrollView
          style={{
            flex: 1,
          }}
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          <View style={styles.container}>

            <Image
              style={styles.logo}
              source={require("../../../assets/images/logo.png")}
            />

            <Text style={styles.titulo}>Local</Text>
            <Text style={styles.infoText}>
              Preencha o formulário para cadastrar um novo local
            </Text>





            <View style={styles.formRegister}>

              {/*<Text style={styles.formFieldTitle}>Nome</Text>
              <TextInput style={styles.formInputText} />

              <Text style={styles.formFieldTitle}>E-mail</Text>
              <TextInput style={styles.formInputText} defaultValue={tipoForm} />

              <Text style={styles.formFieldTitle}>Senha</Text>
              <TextInput
                secureTextEntry={true}
                style={styles.formInputText}
                placeholder="********"
              />*/}

              {campos.map((campo) =>
              (
                <View key={campo.id + campo.nome}>
                  {campo.tipo == 'Password' && (
                    <>
                      <Text style={styles.formFieldTitle}>{campo.nome}</Text>
                      <TextInput
                        secureTextEntry={true}
                        style={styles.formInputText}
                        placeholder="********"
                      />
                    </>
                  )}
                  {campo.tipo == 'Text' && campo.visivel == 'flex' && (
                    <>
                      <Text style={styles.formFieldTitle}>{campo.nome}</Text>
                      <TextInput
                        style={styles.formInputText}
                        value={valores[campo.id] || ''}
                        editable={campo.editavel}
                        onChangeText={(novoValor) => handleChange(campo.id, novoValor)}
                      />
                    </>
                  )}
                  {campo.tipo == 'Numeric' && campo.visivel == 'flex' && (
                    <>
                      <Text style={styles.formFieldTitle}>{campo.nome}</Text>
                      <TextInput
                        style={styles.formInputText}
                        value={valores[campo.id] || ''}
                        editable={campo.editavel}
                        maxLength={8}
                        onChangeText={(novoValor) => handleChange(campo.id, novoValor)}
                        keyboardType="numeric"
                      />
                    </>
                  )}

                  {campo.tipo == 'Switch' && (
                    <>
                      <Text style={styles.formFieldTitle}>{campo.nome}</Text>
                      <Switch
                        trackColor={{ false: '#767577', true: '#9747FF' }}
                        thumbColor={isEnabled ? '#F5D907' : '#f4f3f4'}
                        style={{alignSelf: 'flex-start'}}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                      />
                    </>
                  )}

                  {campo.tipo == 'Dropdown' && (
                    <>
                      <Text style={styles.formFieldTitle}>{campo.nome}</Text>
                      <Dropdown
                        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        iconStyle={styles.iconStyle}
                        data={dropdownLocal}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus ? 'Selecione um item' : '...'}
                        value={value}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                          setValue(item.value);
                          setIsFocus(false);
                          changeForm(item.label)
                        }
                        } />
                    </>
                  )}

                </View>
              ))}

              {tipoForm == 'Pista' &&(
                
                  camposPista.map((campo) =>
                    (
                      <View key={campo.id + campo.nome}>
                        {campo.tipo == 'Password' && (
                          <>
                            <Text style={styles.formFieldTitle}>{campo.nome}</Text>
                            <TextInput
                              secureTextEntry={true}
                              style={styles.formInputText}
                              placeholder="********"
                            />
                          </>
                        )}
                        {campo.tipo == 'Text' && campo.visivel == 'flex' && (
                          <>
                            <Text style={styles.formFieldTitle}>{campo.nome}</Text>
                            <TextInput
                              style={styles.formInputText}
                              value={valores[campo.id] || ''}
                              editable={campo.editavel}
                              onChangeText={(novoValor) => handleChange(campo.id, novoValor)}
                            />
                          </>
                        )}
                        {campo.tipo == 'Numeric' && campo.visivel == 'flex' && (
                          <>
                            <Text style={styles.formFieldTitle}>{campo.nome}</Text>
                            <TextInput
                              style={styles.formInputText}
                              value={valores[campo.id] || ''}
                              editable={campo.editavel}
                              maxLength={8}
                              onChangeText={(novoValor) => handleChange(campo.id, novoValor)}
                              keyboardType="numeric"
                            />
                          </>
                        )}
      
                        {campo.tipo == 'Switch' && (
                          <>
                            <Text style={styles.formFieldTitle}>{campo.nome}</Text>
                            <Switch
                              trackColor={{ false: '#767577', true: '#9747FF' }}
                              thumbColor={isEnabled ? '#F5D907' : '#f4f3f4'}
                              style={{alignSelf: 'flex-start'}}
                              ios_backgroundColor="#3e3e3e"
                              onValueChange={toggleSwitch}
                              value={isEnabled}
                            />
                          </>
                        )}
      
                        {campo.tipo == 'Dropdown' && (
                          <>
                            <Text style={styles.formFieldTitle}>{campo.nome}</Text>
                            <Dropdown
                              style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                              placeholderStyle={styles.placeholderStyle}
                              selectedTextStyle={styles.selectedTextStyle}
                              iconStyle={styles.iconStyle}
                              data={dropdownSimNao}
                              maxHeight={300}
                              labelField="label"
                              valueField="value"
                              placeholder={!isFocus ? 'Selecione um item' : '...'}
                              value={value}
                              onFocus={() => setIsFocus(true)}
                              onBlur={() => setIsFocus(false)}
                              onChange={item => {
                                setValue(item.value);
                                setIsFocus(false);
                                changeForm(item.label)
                              }
                              } />
                          </>
                        )}
      
                      </View>
                    ))
              )}

            </View>

            <TouchableOpacity style={styles.button} onPress={registerAddress}>
              <Text style={styles.textButton}>Cadastrar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </GestureHandlerRootView>
    );
  }
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
    marginTop: 90,
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
  button: {
    backgroundColor: "#9747FF",
    borderRadius: 8,
    paddingHorizontal: 42,
    paddingVertical: 8,
    position: "relative",
    marginVertical: 32
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
  },
  dropdown: {
    height: 50,
    width: 250,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    marginVertical: 16
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});

export default FormCadastros;

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


const API_URL = "http://34.231.200.200:8000";


const dados = [
  { label: 'Pista', value: '1' },
  { label: 'Skateshop', value: '2' },
  { label: 'Evento', value: '3' },
]

const campos = [
  { id: 1, nome: 'CEP', tipo: 'Text' },
  { id: 2, nome: 'Logradouro', tipo: 'Text' },
  { id: 3, nome: 'Número', tipo: 'Text' },
  { id: 4, nome: 'Bairro', tipo: 'Text' },
  { id: 5, nome: 'Cidade', tipo: 'Text' },
  { id: 6, nome: 'Estado', tipo: 'Text' },
  { id: 7, nome: 'País', tipo: 'Text' },
  { id: 9, nome: 'Tipo', tipo: 'Dropdown' },

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
				7: ''       // País
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
            2: data[0]['logradouro'], // Logradouro
            4: data[0]['bairro'],     // Bairro
            5: data[0]['cidade'],     // Cidade
            6: data[0]['estado'],     // Estado
            7: data[0]['pais'],       // País
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
            7: ''       // País
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
                  {campo.tipo == 'Text' && (
                    <>
                      <Text style={styles.formFieldTitle}>{campo.nome}</Text>
                      <TextInput
                        style={styles.formInputText}
                        value={valores[campo.id] || ''}
                        onChangeText={(novoValor) => handleChange(campo.id, novoValor)}
                      />
                    </>
                  )}

                  {campo.tipo == 'Switch' && (
                    <>
                      <Text style={styles.formFieldTitle}>{campo.nome}</Text>
                      <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
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
                        data={dados}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus ? 'Select item' : '...'}
                        searchPlaceholder="Search..."
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

            </View>

            <TouchableOpacity style={styles.button}>
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

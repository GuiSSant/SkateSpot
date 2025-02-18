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
import { TextInputMask } from 'react-native-masked-text';


const API_URL = "http://34.231.200.200:8000";


const dropdownLocal = [
  { label: '', value: '0' },
  { label: 'Pista', value: '1' },
  { label: 'Skateshop', value: '2' },
  { label: 'Evento', value: '3' },
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
  { id: 10, nome: 'Longitude', tipo: 'Text', editavel: false, visivel: "none" },
  { id: 11, nome: 'Nome', tipo: 'Text', editavel: true, visivel: "flex" },
  { id: 12, nome: 'Descrição', tipo: 'Text', editavel: true, visivel: "flex" },
  { id: 13, nome: 'Água', tipo: 'Switch', editavel: true, visivel: "flex" },
  { id: 14, nome: 'Iluminação', tipo: 'Switch', editavel: true, visivel: "flex" },
  { id: 15, nome: 'Banheiro', tipo: 'Switch', editavel: true, visivel: "flex" },
  { id: 16, nome: 'Data de Início', tipo: 'DateTime', editavel: true, visivel: "flex" },
  { id: 17, nome: 'Data de Encerramento', tipo: 'DateTime', editavel: true, visivel: "flex" },
]

let tipoForm = 'TTeste'

function FormCadastros() {

  // Estado para o tipo selecionado
  const [tipoSelecionado, setTipoSelecionado] = useState(null); 
  
  // Estados para as datas
  const [dataInicio, setDataInicio] = useState('');
  const [dataEncerramento, setDataEncerramento] = useState('');

  const [switches, setSwitches] = useState({
    água: false,
    banheiro: false,
    iluminação: false,
  });
  
  const toggleSwitch = (key) => {
    setSwitches((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };


  // Função para atualizar o tipo selecionado
  const handleTipoChange = (item) => {
    setTipoSelecionado(item.value); // Atualiza o tipo selecionado
    setValue(item.value); // Atualiza o valor do dropdown
    changeForm(item.label); // Função existente (se necessário)
  };

  // Função para verificar se o campo deve ser visível
  const isCampoVisivel = (campo) => {
    if (campo.nome === "Nome" || campo.nome === "Descrição") {
      // Campos "Nome" e "Descrição" são visíveis se qualquer tipo for selecionado
      return tipoSelecionado !== null && tipoSelecionado !== "0";
    } else if (
      campo.nome === "Água" ||
      campo.nome === "Banheiro" ||
      campo.nome === "Iluminação"
    ) {
      // Campos "Água", "Banheiro" e "Iluminação" são visíveis apenas se o tipo for "pista" (valor "1")
      return tipoSelecionado === "1";
    } else if (
      campo.nome === "Data de Início" ||
      campo.nome === "Data de Encerramento"
    ) {
      // Campos "Data de Início" e "Data de Encerramento" são visíveis apenas se o tipo for "evento" (valor "3")
      return tipoSelecionado === "3";
    }
    return true; // Outros campos permanecem visíveis
  };


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

  const formatarParaISO = (data) => {
    // Extrai dia, mês, ano, hora e minuto da string
    const [dia, mes, ano, hora, minuto] = data.split(/[/ :]/);
  
    // Cria uma data no fuso horário local
    const dataLocal = new Date(`${ano}-${mes}-${dia}T${hora}:${minuto}:00`);
  
    // Converte para o formato ISO 8601 com offset de fuso horário
    return dataLocal.toISOString().replace('Z', '-03:00');
  };

  const gerarCreateDate = () => {
    const dataAtual = new Date(); // Captura a data e hora atuais
    return dataAtual.toISOString().replace('Z', '-03:00'); // Converte para o formato desejado
  };
  
  useEffect(() => {
    const cep = valores[1]; // O campo de CEP tem id 1
    console.log(Date().toString())
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
    if (value === '0') {
      return Alert.alert("Erro", "É necessário escolher um tipo de local para cadastrar.");
    }
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
      
      console.log(response)
      console.log(response.data['id'])
      registerAddressType(response.data['id'])

    } catch (error) {
      console.error(error)
      Alert.alert("Erro", "Não foi possível cadastrar o endereço. Tente novamente.");
    }
  };

  const registerAddressType = async (location_id: number) => {
    try {
      console.log("Local: ", valores)
      console.log("Tipo: ", value)
      console.log("Switchs: ", switches)

      if (value === '1') {
        const response = await axios.post(`${API_URL}/skate-spots/`, {
          'name': valores[11],
          'description': valores[12],
          'water': switches.água,
          'lighting': switches.iluminação,
          'bathroom': switches.banheiro,
          'location_id': location_id,
          'create_date': gerarCreateDate(),           // Data e hora atuais no formato ISO 8601 com offset
        });
        console.log(response)
        console.log(response.data['id'])      
      }

      if (value === '2') {
        const response = await axios.post(`${API_URL}/skate-shops/`, {
          'name': valores[11],
          'description': valores[12],
          'location_id': location_id,
        });
        console.log(response)
        console.log(response.data['id'])      
      }

      if (value === '3') {
        const response = await axios.post(`${API_URL}/skate-events/`, {
          'name': valores[11],
          'description': valores[12],
          'start_date': formatarParaISO(valores[16]), // Data de início no formato ISO 8601 com offset
          'end_date': formatarParaISO(valores[17]),   // Data de encerramento no formato ISO 8601 com offset
          'location_id': location_id,
          'create_date': gerarCreateDate(),           // Data e hora atuais no formato ISO 8601 com offset
        });
        console.log(response)
        console.log(response.data['id'])      
      }

      Alert.alert("Sucesso", "Local cadastrado com sucesso!");

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
            {campos.map((campo) =>
              isCampoVisivel(campo) && ( // Renderiza o campo apenas se for visível
                <View key={campo.id + campo.nome}>
                  {campo.tipo === "Text" && campo.visivel === "flex" && (
                    <>
                      <Text style={styles.formFieldTitle}>{campo.nome}</Text>
                      <TextInput
                        style={styles.formInputText}
                        value={valores[campo.id] || ""}
                        editable={campo.editavel}
                        onChangeText={(novoValor) => handleChange(campo.id, novoValor)}
                      />
                    </>
                  )}

                  {campo.tipo === "Numeric" && campo.visivel === "flex" && (
                    <>
                      <Text style={styles.formFieldTitle}>{campo.nome}</Text>
                      <TextInput
                        style={styles.formInputText}
                        value={valores[campo.id] || ""}
                        editable={campo.editavel}
                        onChangeText={(novoValor) => handleChange(campo.id, novoValor)}
                        keyboardType="numeric"
                      />
                    </>
                  )}

                  {campo.tipo === "Switch" && (
                    <>
                      <Text style={styles.formFieldTitle}>{campo.nome}</Text>
                      <Switch
                        trackColor={{ false: '#767577', true: '#9747FF' }}
                        thumbColor={switches[campo.nome.toLowerCase()] ? '#F5D907' : '#f4f3f4'}
                        style={{alignSelf: 'flex-start'}}
                        // trackColor={{ false: "#767577", true: "#81b0ff" }}
                        // thumbColor={switches[campo.nome.toLowerCase()] ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => toggleSwitch(campo.nome.toLowerCase())}
                        value={switches[campo.nome.toLowerCase()]}
                      />
                    </>
                  )}

                  {campo.tipo === "Dropdown" && (
                    <>
                      <Text style={styles.formFieldTitle}>{campo.nome}</Text>
                      <Dropdown
                        style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        iconStyle={styles.iconStyle}
                        data={dropdownLocal}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus ? "" : ""}
                        searchPlaceholder="Search..."
                        value={value}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={handleTipoChange} // Usa a nova função para atualizar o tipo
                      />
                    </>
                  )}

                  {campo.tipo === "DateTime" && (
                    <>
                      <Text style={styles.formFieldTitle}>{campo.nome}</Text>
                      <TextInputMask
                        type={'datetime'}
                        options={{
                          format: 'DD/MM/YYYY HH:mm', // Formato da data e hora
                        }}
                        value={campo.nome === "Data de Início" ? dataInicio : dataEncerramento}
                        onChangeText={(text) => {
                          if (campo.nome === "Data de Início") {
                            setDataInicio(text);
                            handleChange(campo.id, text); // Armazena a data no estado
                          } else {
                            setDataEncerramento(text);
                            handleChange(campo.id, text); // Armazena a data no estado
                          }
                        }}
                        style={styles.formInputText}
                        placeholder="DD/MM/AAAA HH:MM"
                        keyboardType="numeric"
                      />
                    </>
                  )}
                </View>
              )
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

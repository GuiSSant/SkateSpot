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
  Modal,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useFonts } from "expo-font";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Dropdown } from "react-native-element-dropdown";
import { TextInputMask } from 'react-native-masked-text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import api from "@/lib/api";
import { ButtonMain } from "@/components/common/ButtonMain";
import * as ImagePicker from 'expo-image-picker';


const API_URL = api.defaults.baseURL || "http:// ";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

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
  const [loading, setLoading] = useState(false);

  const [selectedImages, setSelectedImages] = useState([]);
  
  const [images, setImages] = useState<any[]>([]);
  const [mainImage, setMainImage] = useState<string | null>(null);

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
  

  const handleAddPhotos = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permissão negada', 'Você precisa permitir o acesso à galeria para selecionar fotos.');
        return;
      }

      setSelectedImages([]);

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (result.canceled) {
        console.log("Seleção de fotos cancelada pelo usuário.");
        return;
      }

      if (result.assets && result.assets.length > 0) {
        setSelectedImages(result.assets);
        
      } else {
        Alert.alert('Erro', 'Nenhuma foto selecionada.');
      }
    } catch (error) {
      console.error("Erro ao abrir a galeria:", error);
      Alert.alert('Erro', 'Ocorreu um erro ao abrir a galeria.');
    }
  };


  useEffect(() => {
    const cep = valores[1]; // O campo de CEP tem id 1
    const numero = valores[3]; 
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
    setLoading(true);
    if (value === '0') {
      return Alert.alert("Erro", "É necessário escolher um tipo de local para cadastrar.");
    }
    try {
      console.log("Local: ", valores)

      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.post(
        `${API_URL}/location/`,
        {
          zip_code: valores[1],
          street: valores[2],
          number: valores[3],
          district: valores[4],
          city: valores[5],
          state: valores[6],
          country: valores[7],
        },
        { headers: { Authorization: `Token ${token}` } }
      );
      console.log(response)
      console.log(response.data['id'])
      await registerAddressType(response.data['id']);
      setLoading(false);

    } catch (error) {
      console.error(error)
      Alert.alert("Erro", "Não foi possível cadastrar o endereço. Tente novamente.");
      setLoading(false);
    }
  };

  const removeImage = (uri) => {
    const updatedImages = selectedImages.filter(img => img.uri !== uri);
    setSelectedImages(updatedImages);
    if (updatedImages.length === 0) {
        // Fecha o modal se todas as fotos forem removidas
    }
  };

  const registerAddressType = async (location_id: number) => {
    try {
      console.log("Local: ", valores)
      console.log("Tipo: ", value)
      console.log("Switchs: ", switches)

      if (value === '1') {
        const token = await AsyncStorage.getItem('authToken');
        const response = await axios.post(
          `${API_URL}/skate-spots/`,
          {
            name: valores[11],
            description: valores[12],
            water: switches.água,
            lighting: switches.iluminação,
            bathroom: switches.banheiro,
            location_id: location_id,
            create_date: gerarCreateDate()
          },
          { headers: { Authorization: `Token ${token}` } }
        );
        console.log(response)
        console.log(response.data['id'])     
        registerAddressImages(response.data['id']);
      }

      if (value === '2') {
        const token = await AsyncStorage.getItem('authToken');
        const response = await axios.post(
          `${API_URL}/skate-shops/`,
          {
            name: valores[11],
            description: valores[12],
            location_id: location_id,
            create_date: gerarCreateDate(),
          },
          { headers: { Authorization: `Token ${token}` } }
        );
        console.log(response)
        console.log(response.data['id'])   
        registerAddressImages(response.data['id']);
      }

      if (value === '3') {
        const token = await AsyncStorage.getItem('authToken');
        const response = await axios.post(
          `${API_URL}/skate-events/`,
          {
            name: valores[11],
            description: valores[12],
            location_id: location_id,
            create_date: gerarCreateDate(),
          },
          { headers: { Authorization: `Token ${token}` } }
        );
        console.log(response)
        console.log(response.data['id'])     
        registerAddressImages(response.data['id']);
      }

    } catch (error) {
      console.error(error)
      Alert.alert("Erro", "Não foi possível cadastrar o local. Tente novamente.");
    }
  };

  const registerAddressImages = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      if (!token) {
        Alert.alert("Erro", "Token de autenticação não encontrado.");
        return;
      }

      console.log("Token: ", token)
      
      for (const img of selectedImages) {
        const formData = new FormData();
        formData.append('image', {
          uri: img.uri,
          name: 'photo.jpg',
          type: 'image/jpeg',
        });

        // Pista
        if (value === '1') {
          console.log("skatespot_id: ", id)
          formData.append('skatespot_id', id);
        }

        // Skateshop
        if (value === '2') {
          console.log("skateshop_id: ", id)
          formData.append('skateshop_id', id);
        }

        // Evento
        if (value === '3') {
          console.log("skateevent_id: ", id)
          formData.append('skateevent_id', id);
        }

        console.log("FormData sendo enviado:", formData);

        await axios.post(`${API_URL}/local-images/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Token ${token}`,
          },
        });
      }

      Alert.alert("Sucesso", "Local cadastrado com sucesso!");

    } catch (error) {
      console.error('Erro ao enviar fotos:', error);
      Alert.alert('Erro', 'Erro ao enviar fotos');
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
          {loading && (
            <ActivityIndicator size={75} color="#F5D907" style={{ alignSelf: "center", marginVertical: 16 }} />
          )}
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
                        placeholderStyle={{ color: '#888888', fontSize: 16 }}
                        selectedTextStyle={{ color: '#FFFFFF', fontSize: 16 }}
                        itemTextStyle={{ color: '#FFFFFF' }}
                        containerStyle={{ backgroundColor: '#1C1C1E' }}
                        style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
                        // placeholderStyle={styles.placeholderStyle}
                        // selectedTextStyle={styles.selectedTextStyle}
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

          <TouchableOpacity onPress={handleAddPhotos} style={{ backgroundColor: '#1F1B24', padding: 10, borderRadius: 8, marginBottom: 16 }}>
            <Text style={{ color: '#F5D907', fontFamily: 'Quicksand-Bold', fontSize: 16, textAlign: 'center' }}>Adicionar Fotos</Text>
          </TouchableOpacity>


          {/* Exibir imagens selecionadas */}
          {selectedImages.length > 0 && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 16 }}>
              {selectedImages.map((img, index) => (
                <View key={img.uri || index.toString()} style={{ margin: 4, position: 'relative' }}>
                  <Image source={{ uri: img.uri }} style={{ width: 80, height: 80, borderRadius: 8 }} />
                  <TouchableOpacity
                    onPress={() => removeImage(img.uri)}
                    style={{
                      position: "absolute",
                      top: 2,
                      right: 2,
                      backgroundColor: "rgba(0,0,0,0.6)",
                      borderRadius: 10,
                      paddingHorizontal: 5,
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 12 }}>X</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}


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
    paddingHorizontal: 14,
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
    marginTop: 4,
  },
  button: {
    elevation: 2,
    backgroundColor: "#9747FF",
    borderRadius: 8,
    paddingHorizontal: 42,
    paddingVertical: 8,
    position: "relative",
    marginVertical: 32
  },
  textButton: {
    paddingVertical: 6,
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
    gap: 12,
    marginTop: 24,
    width: "100%",
  },
  formFieldTitle: {
    marginBottom: 8,
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
    color: "#FFFFFF",
    fontSize: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderColor: "#333",
    paddingVertical: 10,
    backgroundColor: "#1C1C1E",
    borderRadius: 8,
    marginTop: 4,
    paddingHorizontal: 14,
  },
  dropdown: {
    height: 50,
    width: 250,
    borderColor: '#333',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: '#1C1C1E',
    marginVertical: 16
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: '#1C1C1E',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    paddingVertical: 6,
    color: "#fff",
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
    lineHeight: 27.5,
    letterSpacing: 0.11,
    textAlign: "center",
  },
  selectedTextStyle: {
    paddingVertical: 6,
    color: "#fff",
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
    lineHeight: 27.5,
    letterSpacing: 0.11,
    textAlign: "center",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",  // Fundo escuro semi-transparente
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: windowWidth * 0.9,
    maxHeight: windowHeight * 0.8,
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
    color: "#FFFFFF",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#FF6F61",  // Cor de botão consistente com seu app
    borderRadius: 10,
  },
  closeButtonText: {
    fontFamily: "Quicksand-Bold",
    color: "#fff",
    fontSize: 16,
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  imageContainer: {
    marginRight: 8,
    position: "relative",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 16,
  },
  removeButton: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 10,
    paddingHorizontal: 5,
  },
  removeButtonText: {
    color: "white",
    fontSize: 12,
  },
  confirmButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#FF6F61",
    borderRadius: 10,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FormCadastros;
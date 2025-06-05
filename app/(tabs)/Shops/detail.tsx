import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableHighlight,
  ImageBackground,
  ScrollView,
  FlatList,
  Modal,
  TouchableOpacity,
  Dimensions,
  Alert
} from "react-native";
import { useFonts } from "expo-font";
import Carrossel from "../../../components/common/Carrossel";
import Midia from "../../../components/common/Midia";
import MainHeader from "../../../components/common/MainHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import api, {getShop } from "@/lib/api";
import { ButtonMain } from "@/components/common/ButtonMain";
import { useRoute } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';

const API_URL = api.defaults.baseURL || "http:// ";

type RouteParams = {
  id: number;
};

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function SkateShop() {
  const route = useRoute();
  const { id } = route.params as RouteParams;

  const [shopName, setshopName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [images, setImages] = useState<any[]>([]);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState([]);
	const [showConfirmation, setShowConfirmation] = useState(false);

  const handleAddPhotos = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permissão negada', 'Você precisa permitir o acesso à galeria para selecionar fotos.');
        return;
      }

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
        setShowConfirmation(true);
      } else {
        Alert.alert('Erro', 'Nenhuma foto selecionada.');
      }
    } catch (error) {
      console.error("Erro ao abrir a galeria:", error);
      Alert.alert('Erro', 'Ocorreu um erro ao abrir a galeria.');
    }
  };


  const removeImage = (uri) => {
    const updatedImages = selectedImages.filter(img => img.uri !== uri);
    setSelectedImages(updatedImages);
    if (updatedImages.length === 0) {
      setShowConfirmation(false);  // Fecha o modal se todas as fotos forem removidas
    }
  };

  const confirmUpload = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      if (!token) {
        Alert.alert("Erro", "Token de autenticação não encontrado.");
        return;
      }

      console.log("Token: ", token)
      console.log("skateshop_id: ", id)
      
      for (const img of selectedImages) {
        const formData = new FormData();
        formData.append('image', {
          uri: img.uri,
          name: 'photo.jpg',
          type: 'image/jpeg',
        });

        formData.append('skateshop_id', id);

        console.log("FormData sendo enviado:", formData);

        await axios.post(`${API_URL}/local-images/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Token ${token}`,
          },
        });
      }

      Alert.alert('Sucesso', 'Fotos enviadas com sucesso!');

      setSelectedImages([]);
      setShowConfirmation(false);

      const response = await api.get(`/skate-shops/${id}/`);
      setImages(response.data.images);

    } catch (error) {
      console.error('Erro ao enviar fotos:', error);
      Alert.alert('Erro', 'Erro ao enviar fotos');
    }
  };

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const response = await getShop(id);
        console.log("Dados da loja:", response.data);

        setshopName(response.data.name || "");
        setDescription(response.data.description || "");
        setImages(response.data.images || []);
        const mainImgObj = response.data.images?.find((img: any) => img.main_image);
        setMainImage(mainImgObj ? mainImgObj.image : null);                     
      } catch (error) {
        console.log("Erro ao carregar dados da loja:", error);
      }

    };

    fetchShopData();
  }, []);


  const [loaded, error] = useFonts({
    "Quicksand-Bold": require("../../../assets/fonts/Quicksand-Bold.ttf"),
    "Quicksand-Regular": require("../../../assets/fonts/Quicksand-Regular.ttf"),
  });

  if (loaded)
    return (
      <>
        <ImageBackground
          source={mainImage ? { uri: mainImage } : require("../../../assets/images/profileBackgroundImage.jpg")}
          resizeMode="cover"
          style={styles.profileBackgroundImage}
          imageStyle={{ opacity: 0.3 }}
        >
          <FlatList
            data={[]} // FlatList vazia, usamos apenas o header aqui
            ListHeaderComponent={
              <View style={styles.container}>
                <MainHeader />
  
                <View style={styles.UserContainer}>
                  <View style={styles.profileContent}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 64, paddingHorizontal: 16 }}>
                      <Text style={styles.nameShop}>
                        {shopName || "Sem Nome"}
                      </Text>
                      <Text style={styles.descriptionText}>
                        {"(4,0)"}
                      </Text>
                    </View>
                    <Text style={[styles.descriptionText, { marginTop: 16 }]}>
                      {description || "Sem Descrição"}
                    </Text>  
  
                    {/* Mídia e botão */}
                    <Midia imagens={images} />
                    <ButtonMain title="Adicionar Fotos" onPress={handleAddPhotos} style={{ marginBottom: 32 }}/>
                  </View>
                </View>
              </View>
            }
            contentContainerStyle={{ paddingBottom: 40 }}
          />
  
          {/* Modal de envio de imagens */}
          <Modal
            visible={showConfirmation}
            transparent
            animationType="fade"
            onRequestClose={() => setShowConfirmation(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <FlatList
                  data={selectedImages}
                  keyExtractor={(item) => item.uri}
                  renderItem={({ item }) => (
                    <View style={styles.imageContainer}>
                      <Image source={{ uri: item.uri }} style={styles.image} />
                      <TouchableOpacity
                        onPress={() => removeImage(item.uri)}
                        style={styles.removeButton}
                      >
                        <Text style={styles.removeButtonText}>X</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  horizontal
                />
                <TouchableOpacity style={styles.confirmButton} onPress={confirmUpload}>
                  <Text style={styles.confirmButtonText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ImageBackground>
      </>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "static",
    height: "100%",
    paddingHorizontal: 16,
  },
  profileBackgroundImage: {
    flex: 1,
    justifyContent: "center",
    height: 350,
    resizeMode: "contain",
    backgroundColor: "#0C0A14",
  },
  UserContainer: {
    marginTop: 320,
    alignItems: "center",
    alignSelf: "center",
    width: "110%",
  },
  HandlerProfilePicture: {
    height: 120,
    width: 120,
    borderRadius: 60,
    zIndex: 1,
  },
  profileContent: {
    backgroundColor: "#fff",
    height: "auto",
    width: "100%",
    alignSelf: "center",
    borderTopStartRadius: 70,
    borderTopEndRadius: 70,
    marginTop: -60,
    paddingHorizontal: 16,
  },
  nameShop: {
    fontSize: 28,
    color: "#212121",
    alignSelf: "center",
    lineHeight: 27.5,
    fontFamily: "Quicksand-Bold",
  },
  descriptionText: {
    fontSize: 14,
    color: "#888", // cinza claro
    marginTop: 4,
    alignSelf: "center",
    paddingHorizontal: 16,
  },
  avaliationText: {
    fontSize: 14,
    color: "#212121",
    alignSelf: "center",
    paddingHorizontal: 16,
  },
  modalityText: {
    fontSize: 20,
    color: "#212121",
    alignSelf: "center",
    paddingHorizontal: 16,
  },
  structureText: {
    fontSize: 14,
    color: "#212121",
    alignSelf: "center",
    paddingHorizontal: 16,
  },
  infraTextActive: {
    fontSize: 14,
    color: "#212121",
    alignSelf: "center",
    paddingHorizontal: 16,
  },
  infraTextNotActive: {
    fontSize: 14,
    color: "#888",
    alignSelf: "center",
    paddingHorizontal: 16,
  },
  textSection: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    lineHeight: 35,
    color: "#212121",
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
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
    color: "#212121",
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

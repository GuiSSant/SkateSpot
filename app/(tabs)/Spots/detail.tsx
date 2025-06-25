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
  ActivityIndicator,
  Alert
} from "react-native";
import { useFonts } from "expo-font";
import Carrossel from "../../../components/common/Carrossel";
import Midia from "../../../components/common/Midia";
import MainHeader from "../../../components/common/MainHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import api, { getModalities, getStructures, getSpot } from "@/lib/api";
import { ButtonMain } from "@/components/common/ButtonMain";
import { useRoute } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/Feather';
import RatingCard from "../Rating/RatingCard";
import RatingModal from "../Rating/RatingModal";
import StarRating from "@/components/common/StarRating";
import DeleteConfirmationModal from "../Rating/DeleteConfirmationModal";
import ImageView from "react-native-image-viewing";

const API_URL = api.defaults.baseURL || "http:// ";

type Structure = {
  id: number;
  name: string;
};

type Modality = {
  id: number;
  name: string;
};

type RouteParams = {
  id: number;
};

type Rating = {
  id: number;
  rating_structures: number;
  rating_location: number;
  rating_spot: number;
  create_date: string;
  skatespot: number;
};

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function SkateSpot() {
  const route = useRoute();
  const { id } = route.params as RouteParams;

  const [spotName, setspotName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [bathroom, setBathroom] = useState<boolean>(false);
  const [water, setwater] = useState<boolean>(false);
  const [lighting, setLighting] = useState<boolean>(false);
  const [modalities, setModalities] = useState<Modality[]>([]);
  const [structures, setStructures] = useState<Structure[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState([]);
	const [showConfirmation, setShowConfirmation] = useState(false);
  const [avgOverall, setAvgOverall] = useState<number>(0);
  const [avgStructures, setAvgStructures] = useState<number>(0);
  const [avgLocation, setAvgLocation] = useState<number>(0);
  const [avgSpot, setAvgSpot] = useState<number>(0);
  const [userRatings, setUserRatings] = useState<Rating[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [ratingModalVisible, setRatingModalVisible] = useState<boolean>(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [ratingToDelete, setRatingToDelete] = useState<number | null>(null);
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

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
      console.log("skatespot_id: ", id)
      
      for (const img of selectedImages) {
        const formData = new FormData();
        formData.append('image', {
          uri: img.uri,
          name: 'photo.jpg',
          type: 'image/jpeg',
        });

        formData.append('skatespot_id', id);

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

      const response = await api.get(`/skate-spots/${id}/`);
      setImages(response.data.images);

    } catch (error) {
      console.error('Erro ao enviar fotos:', error);
      Alert.alert('Erro', 'Erro ao enviar fotos');
    }
  };

  useEffect(() => {
    getStructures().then((res) => setStructures(res.data));
  }, []);

  useEffect(() => {
    getModalities().then((res) => setModalities(res.data));
  }, []);

  useEffect(() => {
    const fetchSpotData = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("authToken");
        const response = await getSpot(id);
        console.log("Dados da pista:", response.data);

        setspotName(response.data.name || "");
        setDescription(response.data.description || "");
        setBathroom(response.data.bathroom || false);
        setwater(response.data.water || false);
        setLighting(response.data.lighting || false);
        setImages(response.data.images || []);
        const mainImgObj = response.data.images?.find((img: any) => img.main_image);
        setMainImage(mainImgObj ? mainImgObj.image : null);      
        setAvgOverall(response.data.avg_overall || 0);
        setAvgStructures(response.data.avg_structures || 0);
        setAvgLocation(response.data.avg_location || 0);
        setAvgSpot(response.data.avg_spot || 0);
        setIsAuthenticated(!!token);       
        
        if (token) {
          try {
            const ratingsResponse = await api.get('/ratings/', {
              headers: { Authorization: `Token ${token}` }
            });
            const spotRatings = ratingsResponse.data.filter(
              (rating: Rating) => rating.skatespot === id
            );
            setUserRatings(spotRatings);
          } catch (error) {
            console.log("Erro ao buscar avaliações:", error);
          }
        }

      } catch (error) {
        console.log("Erro ao carregar dados da pista:", error);
      } finally {
        setLoading(false);
      }

    };

    fetchSpotData();
  }, []);


  const canRate = () => {
    if (!isAuthenticated || userRatings.length === 0) return true;
    
    const lastRatingDate = new Date(userRatings[0].create_date);
    const now = new Date();
    
    return (
      lastRatingDate.getMonth() !== now.getMonth() ||
      lastRatingDate.getFullYear() !== now.getFullYear()
    );
  };

  const handleDeleteRating = async () => {
    if (!ratingToDelete) return;
    
    try {
      const token = await AsyncStorage.getItem('authToken');
      await api.delete(`/ratings/${ratingToDelete}/`, {
        headers: { Authorization: `Token ${token}` }
      });
      
      setUserRatings(prev => prev.filter(rating => rating.id !== ratingToDelete));
      setDeleteModalVisible(false);
      setRatingToDelete(null);
    } catch (error) {
      console.error("Erro ao excluir avaliação:", error);
    }
  };

  const handleRatingSubmitted = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return;
      
      const ratingsResponse = await api.get('/ratings/', {
        headers: { Authorization: `Token ${token}` }
      });
      const spotRatings = ratingsResponse.data.filter(
        (rating: Rating) => rating.skatespot === id
      );
      setUserRatings(spotRatings);
      
      const spotResponse = await getSpot(id);
      setAvgOverall(spotResponse.data.avg_overall || 0);
      setAvgStructures(spotResponse.data.avg_structures || 0);
      setAvgLocation(spotResponse.data.avg_location || 0);
      setAvgSpot(spotResponse.data.avg_spot || 0);
    } catch (error) {
      console.error("Erro ao buscar avaliações atualizadas:", error);
    }
  };

  const renderStars = (rating: number) => (
  <StarRating rating={rating} size={18} />
);


  const [loaded, error] = useFonts({
    "Quicksand-Bold": require("../../../assets/fonts/Quicksand-Bold.ttf"),
    "Quicksand-Regular": require("../../../assets/fonts/Quicksand-Regular.ttf"),
  });

  if (!loaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F5D907" />
      </View>
    );
  }

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
                  <View style={{ marginTop: 64, paddingHorizontal: 16 }}>
                    <Text style={styles.nameSpot}>
                      {spotName || "Sem Nome"}
                    </Text>
                    {/* <View style={{ flexDirection: "row", alignItems: "center", marginTop: 16 }}>
                      {renderStars(avgOverall)}
                      <Text style={{ fontSize: 14, color: "#BBBBBB", marginLeft: 8, paddingBottom: 2 }}>{avgOverall.toFixed(1)}</Text>
                    </View> */}
                  </View>
                  <Text style={[styles.descriptionText, { marginTop: 16 }]}>
                    {description || "Sem Descrição"}
                  </Text>


                  {/* Seção de Avaliações */}
                  <View style={{ marginTop: 20, paddingHorizontal: 16 }}>
                    <Text style={styles.textSection}>Avaliações</Text>
                    
                    <View style={{ marginTop: 10, backgroundColor: '#1E1E1E', borderRadius: 10, padding: 15 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                          <Text style={{ color: '#F5D907', fontFamily: 'Quicksand-Bold', fontSize: 18 }}>
                            Média Geral: {avgOverall.toFixed(1)}
                          </Text>
                          {renderStars(avgOverall)}
                        </View>
                        <View>
                          <Text style={{ color: '#FFFFFF', fontFamily: 'Quicksand-Regular' }}>
                            Estruturas: {avgStructures.toFixed(1)}
                          </Text>
                          <Text style={{ color: '#FFFFFF', fontFamily: 'Quicksand-Regular' }}>
                            Localização: {avgLocation.toFixed(1)}
                          </Text>
                          <Text style={{ color: '#FFFFFF', fontFamily: 'Quicksand-Regular' }}>
                            Pista: {avgSpot.toFixed(1)}
                          </Text>
                        </View>
                      </View>
                      
                      {isAuthenticated && (
                        <TouchableOpacity 
                          style={styles.rateButton}
                          onPress={() => {
                            if (canRate()) {
                              setRatingModalVisible(true);
                            } else {
                              alert('Você só pode avaliar esta pista uma vez por mês.');
                            }
                          }}
                        >
                          <Text style={styles.rateButtonText}>
                            {canRate() ? 'Avaliar esta pista' : 'Você já avaliou este mês'}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    
                    {isAuthenticated && userRatings.length > 0 && (
                      <View style={{ marginTop: 20 }}>
                        <Text style={styles.textSection}>Minhas Avaliações</Text>
                        <FlatList
                          data={userRatings}
                          renderItem={({ item }) => (
                            <RatingCard 
                              rating={item} 
                              onDelete={(id) => {
                                setRatingToDelete(id);
                                setDeleteModalVisible(true);
                              }}
                            />
                          )}
                          keyExtractor={(item) => item.id.toString()}
                        />
                      </View>
                    )}
                  </View>


                  {/* Modalidades */}
                  <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
                    <Text style={styles.textSection}>Modalidades</Text>
                    <View style={styles.cardBox}>
                      {modalities.map((item) => (
                        <View key={item.id} style={styles.chip}>
                          <Text style={styles.chipText}>{item.name}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Estruturas */}
                  <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
                    <Text style={styles.textSection}>Estruturas</Text>
                    <View style={styles.cardBox}>
                      {structures.map((item) => (
                        <View key={item.id} style={styles.chip}>
                          <Text style={styles.chipText}>{item.name}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Infraestrutura */}
                  <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
                    <Text style={styles.textSection}>Infraestrutura</Text>
                    <View style={[styles.cardBox, { justifyContent: "space-between", paddingHorizontal: 16 }]}>
                      <Text style={bathroom ? styles.infraTextActive : styles.infraTextNotActive}>Banheiro</Text>
                      <Text style={lighting ? styles.infraTextActive : styles.infraTextNotActive}>Iluminação</Text>
                      <Text style={water ? styles.infraTextActive : styles.infraTextNotActive}>Água</Text>
                    </View>
                  </View>



                  {/* Mídia e botão */}
                  <Midia imagens={images} onImagePress={(index) => { setImageIndex(index); setIsImageViewVisible(true); }} />
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
      
      <ImageView
        images={images.map(img => ({ uri: img.image }))}
        imageIndex={imageIndex}
        visible={isImageViewVisible}
        onRequestClose={() => setIsImageViewVisible(false)}
        doubleTapToZoomEnabled
      />
</ImageBackground>

      <RatingModal
        visible={ratingModalVisible}
        onClose={() => setRatingModalVisible(false)}
        onSubmit={handleRatingSubmitted}
        spotId={id}
      />
      
      <DeleteConfirmationModal
        visible={deleteModalVisible}
        onCancel={() => {
          setDeleteModalVisible(false);
          setRatingToDelete(null);
        }}
        onConfirm={handleDeleteRating}
      />
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
    backgroundColor: "#1C1C1E",
    height: "auto",
    width: "100%",
    alignSelf: "center",
    borderTopStartRadius: 70,
    borderTopEndRadius: 70,
    marginTop: -60,
    paddingHorizontal: 16,
  },
  nameSpot: {
    fontSize: 28,
    color: "#FFFFFF",
    alignSelf: "center",
    lineHeight: 27.5,
    fontFamily: "Quicksand-Bold",
  },
  descriptionText: {
    fontSize: 14,
    color: "#BBBBBB", // cinza claro
    marginTop: 4,
    alignSelf: "center",
    paddingHorizontal: 16,
  },
  avaliationText: {
    fontSize: 14,
    color: "#BBBBBB",
    alignSelf: "center",
    paddingHorizontal: 16,
  },
  modalityText: {
    fontSize: 20,
    color: "#FFFFFF",
    alignSelf: "center",
    paddingHorizontal: 16,
  },
  structureText: {
    fontSize: 14,
    color: "#FFFFFF",
    alignSelf: "center",
    paddingHorizontal: 16,
  },
  infraTextActive: {
    fontSize: 14,
    color: "#F5D907",
    alignSelf: "center",
    paddingHorizontal: 16,
  },
  infraTextNotActive: {
    fontSize: 14,
    color: "#AAAAAA",
    alignSelf: "center",
    paddingHorizontal: 16,
  },
  textSection: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    lineHeight: 35,
    color: "#FFF",
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
  cardBox: {
    backgroundColor: "#2C2C2E",
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },

  chip: {
    backgroundColor: "#333", // ou #444
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 4,
  },

  chipText: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "Quicksand-Regular",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0C0A14',
  },
  rateButton: {
    marginTop: 15,
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  rateButtonText: {
    color: '#F5D907',
    fontFamily: 'Quicksand-Bold',
  },
});
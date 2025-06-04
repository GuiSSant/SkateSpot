import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  FlatList,
  Modal,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from "react-native";
import { useFonts } from "expo-font";
import Midia from "../../../components/common/Midia";
import UploadImages from "../../../components/common/UploadImages";
import MainHeader from "../../../components/common/MainHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api, { getModalities, getStructures, getSpot } from "@/lib/api";
import { ButtonMain } from "@/components/common/ButtonMain";
import { useRoute } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/Feather';
import RatingCard from "../Rating/RatingCard";
import RatingModal from "../Rating/RatingModal";
import DeleteConfirmationModal from "../Rating/DeleteConfirmationModal";

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

  const handleAddPhotos = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: [ImagePicker.MediaType.Image],
    });
    if (!result.canceled) {
      setSelectedImages(result.assets);
      setShowConfirmation(true);  // Abre a telinha de confirmação
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
  }, [id]);

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

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Icon key={`full-${i}`} name="star" size={20} color="#F5D907" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <Icon key="half" name="star-half" size={20} color="#F5D907" />
      );
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Icon key={`empty-${i}`} name="star" size={20} color="#CCCCCC" />
      );
    }
    
    return <View style={{ flexDirection: 'row' }}>{stars}</View>;
  };

  const [loaded] = useFonts({
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
        <ScrollView>
          <View style={styles.container}>
            <MainHeader />

            <View style={styles.UserContainer}>
              <View style={styles.profileContent}>
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 64, paddingHorizontal: 16 }}>
                  <Text style={styles.nameSpot}>
                    {spotName || "Sem Nome"}
                  </Text>
                  <View style={{ marginLeft: 10 }}>
                    {renderStars(avgOverall)}
                    <Text style={styles.avaliationText}>({avgOverall.toFixed(1)})</Text>
                  </View>
                </View>
                <Text style={[styles.descriptionText, { marginTop: 16 }]}>
                  {description || "Sem Descrição"}
                </Text>



                <View style={{ flex: 1 }}>
                  <Text style={[styles.textSection, { marginTop: 16, paddingHorizontal: 16 }]}>
                    {"Modalidades"}
                  </Text>
                  <FlatList
                    data={modalities}
                    numColumns={3}
                    contentContainerStyle={{ alignItems: 'center' }}
                    renderItem={({ item }) => (
                      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 16, paddingHorizontal: 16 }}>
                        <Text style={styles.modalityText}>{item?.name || "Item"}</Text>
                      </View>
                    )}
                    keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
                  />  
                  <Text style={[styles.textSection, { marginTop: 16, paddingHorizontal: 16 }]}>
                    {"Estruturas"}
                  </Text>
                  <FlatList
                    data={structures}
                    numColumns={3}
                    contentContainerStyle={{ alignItems: 'center' }}
                    renderItem={({ item }) => (
                      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 16, paddingHorizontal: 16 }}>
                        <Text style={styles.structureText}>{item?.name || "Item"}</Text>
                      </View>
                    )}
                    keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
                  />

                  <Text style={[styles.textSection, { marginTop: 16, paddingHorizontal: 16 }]}>
                    {"Infraestrutura"}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center", marginTop: 16, paddingHorizontal: 32, justifyContent: 'space-between', width: "100%" }}>
                    <Text style={bathroom ? styles.infraTextActive : styles.infraTextNotActive}>
                      {"Banheiro"}
                    </Text>
                    <Text style={lighting ? styles.infraTextActive : styles.infraTextNotActive}>
                      {"Iluminação"}
                    </Text>
                    <Text style={water ? styles.infraTextActive : styles.infraTextNotActive}>
                      {"Água"}
                    </Text>
                  </View>
                  
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

                  <Midia imagens={images} />

                    {/* Botão para exibir o UploadImages */}
                    <ButtonMain title="Adicionar Fotos" onPress={handleAddPhotos} />

                    {/* Exibir UploadImages em um Modal */}
                  <Modal
                    visible={showConfirmation}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowConfirmation(false)}
                  >
                    <View style={styles.modalOverlay}>
                      <View style={styles.modalContainer}>
                        <UploadImages
                          localId={id}
                          tipo="skatespot"
                          selectedImages={selectedImages}
                          setSelectedImages={setSelectedImages}
                          onClose={() => setShowConfirmation(false)}
                        />
                      </View>
                    </View>
                  </Modal>

                    {/* <ButtonMain title={"Adicionar Fotos"} style={{marginBottom: 32}} onPress={() => {alert("Imagem adicionada"); }} /> */}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
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
    backgroundColor: "#fff",
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

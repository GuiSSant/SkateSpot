
import React from 'react';
import { View, Image, TouchableOpacity, FlatList, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/lib/api";

const API_URL = api.defaults.baseURL || "http:// ";

export default function UploadImages({ localId, tipo, selectedImages, setSelectedImages, onClose }) {

  const removeImage = (uri) => {
    setSelectedImages(selectedImages.filter(img => img.uri !== uri));
  };

  const confirmUpload = async () => {
    const token = await AsyncStorage.getItem('authToken');
    const formData = new FormData();
    selectedImages.forEach((img) => {
      formData.append('image', {
        uri: img.uri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });
    });
    formData.append(`${tipo}_id`, localId);

    try {
      const response = await axios.post(`${API_URL}/local-images/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      alert('Fotos enviadas!');
      setSelectedImages([]);
      onClose();  // Fecha a telinha de confirmação após o envio
    } catch (error) {
      console.log('Erro ao enviar fotos:', error);
      alert('Erro ao enviar fotos');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirmar Fotos</Text>
      {selectedImages.length > 0 ? (
        <FlatList
          data={selectedImages}
          keyExtractor={(item) => item.uri}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.uri }} style={styles.image} />
              <TouchableOpacity onPress={() => removeImage(item.uri)} style={styles.removeButton}>
                <Text style={styles.removeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          )}
          horizontal
        />
      ) : (
        <Text>Nenhuma foto selecionada.</Text>
      )}
      <View style={styles.buttonRow}>
        <Button title="Confirmar" onPress={confirmUpload} />
        <Button title="Cancelar" onPress={onClose} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    paddingHorizontal: 5,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
    width: '80%',
  },
});
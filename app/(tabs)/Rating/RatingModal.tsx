import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import api from '@/lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RatingModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  spotId: number;
}

const RatingModal: React.FC<RatingModalProps> = ({ 
  visible, 
  onClose, 
  onSubmit,
  spotId,
}) => {
  const [structures, setStructures] = useState('');
  const [location, setLocation] = useState('');
  const [spot, setSpot] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    // Validação básica
    if (!structures || !location || !spot) {
      setError('Por favor, preencha todas as notas');
      return;
    }

    const numStructures = parseInt(structures);
    const numLocation = parseInt(location);
    const numSpot = parseInt(spot);

    if (numStructures < 1 || numStructures > 5 || 
        numLocation < 1 || numLocation > 5 || 
        numSpot < 1 || numSpot > 5) {
      setError('As notas devem ser entre 1 e 5');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      const payload = {
        skatespot: spotId,
        rating_structures: numStructures,
        rating_location: numLocation,
        rating_spot: numSpot
      };

      // Criar nova avaliação
      await api.post('/ratings/', payload, {
        headers: { Authorization: `Token ${token}` }
      });

      onSubmit();
      onClose();
      
      // Resetar os campos após envio
      setStructures('');
      setLocation('');
      setSpot('');
      setError('');
    } catch (err) {
      setError('Erro ao enviar avaliação. Tente novamente.');
      console.error('Erro ao enviar avaliação:', err);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Avaliar Pista</Text>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <View style={styles.ratingInput}>
            <Text style={styles.inputLabel}>Estruturas (1-5):</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={structures}
              onChangeText={setStructures}
              maxLength={1}
              placeholder="0"
              placeholderTextColor="#777"
            />
          </View>
          
          <View style={styles.ratingInput}>
            <Text style={styles.inputLabel}>Localização (1-5):</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={location}
              onChangeText={setLocation}
              maxLength={1}
              placeholder="0"
              placeholderTextColor="#777"
            />
          </View>
          
          <View style={styles.ratingInput}>
            <Text style={styles.inputLabel}>Pista (1-5):</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={spot}
              onChangeText={setSpot}
              maxLength={1}
              placeholder="0"
              placeholderTextColor="#777"
            />
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.submitButton]} 
              onPress={handleSubmit}
            >
              <Text style={[styles.buttonText, { color: '#000' }]}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 20,
    width: '85%',
  },
  modalTitle: {
    color: '#F5D907',
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  ratingInput: {
    marginBottom: 15,
  },
  inputLabel: {
    color: '#FFFFFF',
    fontFamily: 'Quicksand-Regular',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 10,
    color: '#FFFFFF',
    fontFamily: 'Quicksand-Regular',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#333',
  },
  submitButton: {
    backgroundColor: '#F5D907',
  },
  buttonText: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: 'Quicksand-Regular',
  },
});

export default RatingModal;
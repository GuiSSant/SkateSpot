import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import api from '@/lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RatingModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  spotId: number;
}

const RatingModal: React.FC<RatingModalProps> = ({ visible, onClose, onSubmit, spotId }) => {
  const [structures, setStructures] = useState(0);
  const [location, setLocation] = useState(0);
  const [spot, setSpot] = useState(0);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!structures || !location || !spot) {
      setError('Por favor, avalie todos os critérios');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      const payload = {
        skatespot: spotId,
        rating_structures: structures,
        rating_location: location,
        rating_spot: spot
      };

      await api.post('/ratings/', payload, {
        headers: { Authorization: `Token ${token}` }
      });

      onSubmit();
      onClose();

      setStructures(0);
      setLocation(0);
      setSpot(0);
      setError('');
    } catch (err) {
      setError('Erro ao enviar avaliação. Tente novamente.');
      console.error('Erro ao enviar avaliação:', err);
    }
  };

  const InteractiveStarRating = ({ rating, onChange }: { rating: number, onChange: (value: number) => void }) => {
    // Cores baseadas na nota
    let color = '#FFD700'; // padrão
    if (rating < 3) color = '#FF3B30';
    else if (rating >= 4) color = '#34C759';

    return (
      <View style={{ flexDirection: 'row', marginVertical: 5 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <TouchableOpacity key={i} onPress={() => onChange(i)}>
            <Icon
              name={i <= rating ? 'star' : 'star-o'}
              size={30}
              color={color}
              style={{ marginHorizontal: 2 }}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
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
            <Text style={styles.inputLabel}>Estruturas:</Text>
            <InteractiveStarRating rating={structures} onChange={setStructures} />
          </View>

          <View style={styles.ratingInput}>
            <Text style={styles.inputLabel}>Localização:</Text>
            <InteractiveStarRating rating={location} onChange={setLocation} />
          </View>

          <View style={styles.ratingInput}>
            <Text style={styles.inputLabel}>Pista:</Text>
            <InteractiveStarRating rating={spot} onChange={setSpot} />
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

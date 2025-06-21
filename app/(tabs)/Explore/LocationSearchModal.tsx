
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Constants from 'expo-constants';
import 'react-native-get-random-values';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelectLocation: (location: { latitude: number; longitude: number }) => void;
  onUseCurrentLocation: () => void; // <- nova prop
}

const LocationSearchModal: React.FC<Props> = ({ visible, onClose, onSelectLocation, onUseCurrentLocation }) => {
  const apiKey =
    Constants.expoConfig?.extra?.GOOGLE_API_KEY || Constants.manifest?.extra?.GOOGLE_API_KEY;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalContainer}
        >
          <View style={styles.inner}>
            <Text style={styles.title}>Buscar Localização</Text>

            <GooglePlacesAutocomplete
              placeholder="Digite o endereço..."
              onPress={(data, details = null) => {
                if (details?.geometry) {
                  const { lat, lng } = details.geometry.location;
                  onSelectLocation({ latitude: lat, longitude: lng });
                  onClose();
                }
              }}
              fetchDetails={true}
              query={{
                key: apiKey,
                language: 'pt-BR',
              }}
              styles={{
                container: { flex: 0 },
                textInput: {
                  backgroundColor: '#555',
                  color: '#fff',
                  padding: 12,
                  borderRadius: 8,
                  fontSize: 16,
                },
                listView: {
                  backgroundColor: '#222',
                  zIndex: 100,
                },
                description: {
                  color: '#fff',
                },
                row: {
                  backgroundColor: '#222',
                  padding: 10,
                },
              }}
            />

            <TouchableOpacity onPress={onUseCurrentLocation} style={styles.gpsButton}>
              <Text style={styles.gpsButtonText}>📍 Localização Atual</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose} style={styles.close}>
              <Text style={styles.closeText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    alignSelf: 'center',
    width: '95%',
  },
  inner: {
    justifyContent: 'flex-start',
  },
  title: {
    color: '#F5D907',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  gpsButton: {
    marginBottom: 12,
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  gpsButtonText: {
    color: '#F5D907',
    fontSize: 16,
    fontWeight: 'bold',
  },
  close: {
    marginTop: 20,
    backgroundColor: '#444',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeText: {
    color: '#F5D907',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LocationSearchModal;
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios'; // Não se esqueça de importar o axios
import { RootStackParamList } from "../(tabs)/_layout"; // Ajuste o caminho conforme necessário

// Defina a interface para a resposta da API
interface NominatimResponse {
  lat: string;
  lon: string;
  display_name: string;
  // Você pode adicionar outros campos que precisar
}

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'LocationSearch'>;

const LocationSearch = () => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation<NavigationProps>();

  const handleSelectLocation = async () => {
    if (!query) {
      setError('Por favor, insira uma localização.');
      return;
    }

    try {
      // Chamando a API de geocodificação do Nominatim
      const response = await axios.get<NominatimResponse[]>(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: query,
          format: 'json',
          limit: 1,
        },
        headers: {
          'User-Agent': 'SkateSpot/1.0', // Altere para o nome do seu aplicativo e versão
        },
      });

      // Verificando se encontramos resultados
      if (response.data.length > 0) {
        const location = response.data[0];
        const newLocation = { latitude: parseFloat(location.lat), longitude: parseFloat(location.lon) };
        navigation.navigate('Explore', { newLocation });
      } else {
        setError('Localização não encontrada.');
      }
    } catch (error) {
      console.error('Erro ao buscar localização:', error);
      setError('Ocorreu um erro ao buscar a localização.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Digite a localização..."
        value={query}
        onChangeText={setQuery}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity style={styles.selectButton} onPress={handleSelectLocation}>
        <Text style={styles.selectButtonText}>Selecionar Localização</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  searchBar: { height: 45, borderColor: '#ccc', borderWidth: 1, borderRadius: 25, paddingHorizontal: 12, marginBottom: 10 },
  selectButton: { marginTop: 20, backgroundColor: '#007bff', padding: 10, borderRadius: 25, alignItems: 'center' },
  selectButtonText: { color: '#fff', fontSize: 16 },
  errorText: { color: 'red', marginVertical: 10 },
});

export default LocationSearch;

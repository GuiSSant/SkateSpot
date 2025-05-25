import { useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { View, ScrollView, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { getModality, deleteModality } from '@/lib/api';
import { ButtonMain } from '@/components/common/ButtonMain';

type Modality = {
  id: number;
  name: string;
  description: string;
};

export default function ModalityDetail() {
  const { id } = useLocalSearchParams();
  const [modality, setModality] = useState<Modality | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchModality = async () => {
      try {
        const res = await getModality(Number(id));
        setModality(res.data);
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchModality();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteModality(Number(id));
      router.push('/Modalities');
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9747FF" />
      </View>
    );
  }

  if (!modality) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Modalidade não encontrada</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Detalhes da Modalidade</Text>
          
          <View style={styles.card}>
            <Text style={styles.modalityName}>{modality.name}</Text>
            {modality.description && (
              <Text style={styles.modalityDescription}>{modality.description}</Text>
            )}
          </View>

          <View style={styles.buttonGroup}>
            <ButtonMain
              title="Editar"
              onPress={() => router.push({ pathname: '/Modalities/edit', params: { id } })}
              style={styles.editButton}
            />
            <ButtonMain
              title="Excluir"
              onPress={handleDelete}
              style={styles.deleteButton}
              textStyle={styles.deleteButtonText}
            />
          </View>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#0C0A14',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  title: {
    color: '#fff',
    fontFamily: 'Quicksand-Bold',
    fontSize: 22,
    lineHeight: 27.5,
    letterSpacing: 0.11,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#1E1B2B',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 24,
  },
  modalityName: {
    color: '#F5D907',
    fontFamily: 'Quicksand-Bold',
    fontSize: 20,
    marginBottom: 12,
  },
  modalityDescription: {
    color: '#fff',
    fontFamily: 'Quicksand-Regular',
    fontSize: 16,
    lineHeight: 22,
  },
  buttonGroup: {
    width: '100%',
    flexDirection: 'column',
    gap: 16,
  },
  editButton: {
    backgroundColor: '#9747FF',
  },
  deleteButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  deleteButtonText: {
    color: '#FF3B30',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0C0A14',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0C0A14',
  },
  errorText: {
    color: '#fff',
    fontFamily: 'Quicksand-Regular',
    fontSize: 16,
  },
});
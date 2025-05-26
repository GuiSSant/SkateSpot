import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ScrollView } from 'react-native-gesture-handler';
import ModalityForm from '@/app/(tabs)/FormCadastros/ModalityForm';
import { getModality, updateModality } from '@/lib/api';
import { ButtonMain } from '@/components/common/ButtonMain';
import MainHeader from "@/components/common/MainHeader";


export default function EditModality() {
  const { id } = useLocalSearchParams();
  const [modality, setModality] = useState<{ name?: string; description?: string } | null>(null);
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

  const handleSubmit = async (data: { name: string; description?: string }) => {
    try {
      await updateModality(Number(id), data);
      router.push({ pathname: '/Modalities/detail', params: { id } });
    } catch (error) {
      console.error('Error no update:', error);
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
        <MainHeader />
        <View style={styles.container}>
          <Text style={styles.title}>Editar Modalidade</Text>
          <Text style={styles.subtitle}>
            Atualize os campos abaixo para modificar esta modalidade
          </Text>

          <ModalityForm initialData={modality} onSubmit={handleSubmit}>
            {({ handleSubmit }) => (
              <View style={styles.buttonGroup}>
                <ButtonMain
                  title="Salvar Alterações"
                  onPress={handleSubmit}
                  style={styles.saveButton}
                />
                <ButtonMain
                  title="Cancelar"
                  onPress={() => router.back()}
                  style={styles.cancelButton}
                  textStyle={styles.cancelButtonText}
                />
              </View>
            )}
          </ModalityForm>
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
    paddingBottom: 20,
  },
  title: {
    color: '#fff',
    fontFamily: 'Quicksand-Bold',
    fontSize: 22,
    lineHeight: 27.5,
    letterSpacing: 0.11,
    marginBottom: 12,
    marginTop: 180
  },
  subtitle: {
    color: '#fff',
    fontFamily: 'Quicksand-Regular',
    fontSize: 14,
    lineHeight: 17.5,
    letterSpacing: 0.11,
    textAlign: 'center',
    marginHorizontal: 28,
    marginBottom: 32,
  },
  buttonGroup: {
    width: '100%',
    marginTop: 24,
  },
  saveButton: {
    marginBottom: 16,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#9747FF',
  },
  cancelButtonText: {
    color: '#9747FF',
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
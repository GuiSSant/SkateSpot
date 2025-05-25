import { useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import StructureForm from '@/app/(tabs)/FormCadastros/StructureForm';
import { getStructure, updateStructure } from '@/lib/api';
import { ButtonMain } from '@/components/common/ButtonMain';
import { Text } from '@/components/Themed';

export default function EditStructure() {
  const { id } = useLocalSearchParams();
  const [structure, setStructure] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStructure = async () => {
      try {
        const res = await getStructure(Number(id));
        setStructure(res.data);
      } catch (error) {
        console.error('Erro ao carregar:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchStructure();
  }, [id]);

  const handleSubmit = async (data: any) => {
    try {
      await updateStructure(Number(id), data);
      router.push({ pathname: '/Structure/detail', params: { id } });
    } catch (error) {
      console.error('Erro update:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9747FF" />
      </View>
    );
  }

  if (!structure) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Estrutura não encontrada</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Editar Estrutura</Text>
          <Text style={styles.subtitle}>
            Atualize a estrutura
          </Text>

          <StructureForm initialData={structure} onSubmit={handleSubmit}>
            {({ handleSubmit }) => (
              <View style={styles.buttonContainer}>
                <ButtonMain
                  title="Salvar Alterações"
                  onPress={handleSubmit}
                  style={styles.submitButton}
                />
                <ButtonMain
                  title="Cancelar"
                  onPress={() => router.back()}
                  style={styles.cancelButton}
                  textStyle={styles.cancelButtonText}
                />
              </View>
            )}
          </StructureForm>
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
  buttonContainer: {
    width: '100%',
    marginTop: 24,
  },
  submitButton: {
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
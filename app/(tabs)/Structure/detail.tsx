import { useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { View, ScrollView, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { getStructure, deleteStructure } from '@/lib/api';
import { ButtonMain } from '@/components/common/ButtonMain';
import { Text } from '@/components/Themed';

export default function StructureDetail() {
  const { id } = useLocalSearchParams();
  const [structure, setStructure] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStructure = async () => {
      try {
        const res = await getStructure(Number(id));
        setStructure(res.data);
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchStructure();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteStructure(Number(id));
      router.push('/Structure');
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
          <Text style={styles.title}>Detalhes da Estrutura</Text>
          
          <View style={styles.card}>
            <Text style={styles.structureName}>{structure.name}</Text>
            {structure.description && (
              <Text style={styles.structureDescription}>{structure.description}</Text>
            )}
          </View>

          <View style={styles.buttonGroup}>
            <ButtonMain
              title="Editar"
              onPress={() => router.push({ pathname: '/Structure/edit', params: { id } })}
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
  structureName: {
    color: '#F5D907',
    fontFamily: 'Quicksand-Bold',
    fontSize: 20,
    marginBottom: 12,
  },
  structureDescription: {
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
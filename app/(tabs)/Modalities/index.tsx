import { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { getModalities } from '@/lib/api';
import { ButtonMain } from '@/components/common/ButtonMain';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ScrollView } from 'react-native-gesture-handler';
import MainHeader from "@/components/common/MainHeader";


type Modality = {
  id: number;
  name: string;
};

export default function ModalitiesList() {
  const [modalities, setModalities] = useState<Modality[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchModalities = async () => {
      try {
        const res = await getModalities();
        setModalities(res.data);
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModalities();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9747FF" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <MainHeader />
        <View style={styles.container}>
          <Text style={styles.title}>Modalidades</Text>
          <Text style={styles.subtitle}>
             Edite ou crie modalidades 
          </Text>

          <ButtonMain
            title="Nova"
            onPress={() => router.push('/Modalities/new')}
            style={styles.nova}
          />
          <FlatList
            data={modalities}
            scrollEnabled={false}
            contentContainerStyle={styles.listContainer}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => [
                  styles.modalityItem,
                  { opacity: pressed ? 0.6 : 1 }
                ]}
                onPress={() =>
                  router.push({ pathname: '/Modalities/detail', params: { id: item.id } })
                }
              >
                <Text style={styles.text}>Modalidade {item.name}</Text>
                <Text style={styles.details}>+</Text>
              </Pressable>
            )}
          />
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
    marginBottom: 12,
    marginTop: 80
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
  text: {
  color: '#fff',
    fontFamily: 'Quicksand-Bold',
    fontSize: 18,
    lineHeight: 17.5,
    letterSpacing: 0.11,
    textAlign: 'center',
  },
  nova: {
    width: '40%',
    marginBottom: 20,
  },
  listContainer: {
    width: '100%',
  },
  modalityItem: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalityName: {
    color: '#fff',
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
    flex: 1,
  },
  details: {
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 17.5,
    letterSpacing: 0.11,
    color: '#9747FF',
    fontFamily: 'Quicksand-Regular',
    marginLeft: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0C0A14',
  },
});
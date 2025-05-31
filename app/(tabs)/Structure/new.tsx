import { router } from 'expo-router';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import StructureForm from '@/app/(tabs)/FormCadastros/StructureForm';
import { createStructure } from '@/lib/api';
import { ButtonMain } from '@/components/common/ButtonMain';
import MainHeader from "@/components/common/MainHeader";


export default function CreateStructure() {
  const handleSubmit = async (data: any) => {

    try {
      await createStructure(data);
      router.push('/Structure');
    } catch (error) {
      console.error('Erro:', error);
    }

  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <MainHeader />
        <View style={styles.container}>
          <Text style={styles.title}>Nova Estrutura</Text>
          <Text style={styles.subtitle}>
            Cria uma nova estrutura
          </Text>

          <StructureForm onSubmit={handleSubmit}>
            {({ handleSubmit }) => (
              <ButtonMain
                title="Criar Estrutura"
                onPress={handleSubmit}
                style={styles.submitButton}
              />
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
  },
  title: {
    color: '#fff',
    fontFamily: 'Quicksand-Bold',
    fontSize: 22,
    lineHeight: 27.5,
    letterSpacing: 0.11,
    marginTop: 80,
    marginBottom: 12
  },
  subtitle: {
    color: '#fff',
    fontFamily: 'Quicksand-Regular',
    fontSize: 14,
    lineHeight: 17.5,
    letterSpacing: 0.11,
    textAlign: 'center',
    marginHorizontal: 28,
    marginBottom: 32
  },
  submitButton: {
    width: '100%',
    marginTop: 40,
  },
});
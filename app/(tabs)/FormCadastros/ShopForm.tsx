import { View, TextInput, StyleSheet, Text } from 'react-native';
import { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ScrollView } from 'react-native-gesture-handler';
import { ButtonMain } from '@/components/common/ButtonMain';

type ShopFormProps = {
  onSubmit: (data: { name: string; description?: string, locationId?: string }) => void;
  initialData?: { name?: string; description?: string, locationId?: string };
  children?: (args: { handleSubmit: () => void }) => JSX.Element;
};

export default function ShopForm({ 
  onSubmit, 
  initialData = {}, 
  children 
}: ShopFormProps) {
  const [name, setName] = useState(initialData.name || '');
  const [description, setDescription] = useState(initialData.description || '');
const [locationId, setLocationId] = useState(initialData.description || '');


  const handleSubmit = () => {
    onSubmit({ name, description });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholderTextColor="#A0A0A0"
            />
          </View>
         <View style={styles.formGroup}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={description}
              onChangeText={setDescription}
              placeholderTextColor="#A0A0A0"
              multiline
              numberOfLines={4}
            />
            </View>
              <View style={styles.formGroup}>
            <Text style={styles.label}>Local</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={locationId}
              onChangeText={setLocationId}
              placeholderTextColor="#A0A0A0"
              multiline
              numberOfLines={4}
            />
          </View>
          {children ? children({ handleSubmit }) : (
            <ButtonMain
              title="Salvar"
              onPress={handleSubmit}
              style={styles.submitButton}
            />
            
          )}
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
    backgroundColor: '#0C0A14',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    color: '#F5D907',
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1E1B2B',
    borderRadius: 8,
    padding: 16,
    color: '#fff',
    fontFamily: 'Quicksand-Regular',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2A2638',
  },
  multilineInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 24,
  },
});
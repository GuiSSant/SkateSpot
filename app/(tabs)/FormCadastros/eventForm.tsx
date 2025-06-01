import { View, TextInput, StyleSheet, Text } from 'react-native';
import { useState } from 'react';
import { GestureHandlerRootView, Pressable } from 'react-native-gesture-handler';
import { ScrollView } from 'react-native-gesture-handler';
import { ButtonMain } from '@/components/common/ButtonMain';
import DatePicker from 'react-native-date-picker';

type EventFormProps = {
  onSubmit: (data: { 
    name: string; 
    description?: string; 
    start_date: string; 
    end_date: string; 
    location_id: number 
  }) => void;
  initialData?: {
    name?: string; 
    description?: string; 
    start_date?: string; 
    end_date?: string; 
    location_id?: number
  };
  children?: (args: { handleSubmit: () => void }) => JSX.Element;
};

export default function EventForm({ 
  onSubmit, 
  initialData = {}, 
  children 
}: EventFormProps) {
  const [name, setName] = useState(initialData.name || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [startDate, setStartDate] = useState(new Date(initialData.start_date || Date.now()));
  const [endDate, setEndDate] = useState(new Date(initialData.end_date || Date.now()));
  const [locationId, setLocationId] = useState<string>(initialData.location_id?.toString() || '');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const formatDate = (date: Date) => {
    return date.toISOString();
  };

  const handleSubmit = () => {
    onSubmit({ 
      name,
      description,
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
      location_id: Number(locationId) 
    });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Name Field */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nome do Evento</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Digite o nome do evento"
              placeholderTextColor="#A0A0A0"
            />
          </View>

          {/* Description Field */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={description}
              onChangeText={setDescription}
              placeholder="Descreva o evento"
              placeholderTextColor="#A0A0A0"
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Start Date Field */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Data de Início</Text>
            <Pressable
              style={styles.input}
              onPress={() => setShowStartPicker(true)}
            >
              <Text style={{ color: '#fff' }}>
                {startDate.toLocaleDateString('pt-BR')}
              </Text>
            </Pressable>
            {showStartPicker && (
              <DatePicker
                date={startDate}
                onDateChange={setStartDate}
                mode="datetime"
                locale="pt-BR"
                modal
                open={showStartPicker}
                onConfirm={(date) => {
                  setStartDate(date);
                  setShowStartPicker(false);
                }}
                onCancel={() => {
                  setShowStartPicker(false);
                }}
                confirmText="Confirmar"
                cancelText="Cancelar"
                theme="dark"
              />
            )}
          </View>

          {/* End Date Field */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Data de Término</Text>
            <Pressable
              style={styles.input}
              onPress={() => setShowEndPicker(true)}
            >
              <Text style={{ color: '#fff' }}>
                {endDate.toLocaleDateString('pt-BR')}
              </Text>
            </Pressable>
            {showEndPicker && (
              <DatePicker
                date={endDate}
                onDateChange={setEndDate}
                mode="datetime"
                locale="pt-BR"
                modal
                open={showEndPicker}
                onConfirm={(date) => {
                  setEndDate(date);
                  setShowEndPicker(false);
                }}
                onCancel={() => {
                  setShowEndPicker(false);
                }}
                confirmText="Confirmar"
                cancelText="Cancelar"
                theme="dark"
              />
            )}
          </View>

          {/* Location ID Field */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>ID do Local</Text>
            <TextInput
              style={styles.input}
              value={locationId}
              onChangeText={setLocationId}
              placeholder="Digite o ID do local"
              placeholderTextColor="#A0A0A0"
              keyboardType="numeric"
            />
          </View>

          {/* Submit Button */}
          {children ? children({ handleSubmit }) : (
            <ButtonMain
              title="Salvar Evento"
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
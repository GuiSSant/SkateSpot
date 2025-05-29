import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

interface ModalProps {
  visible: boolean;
  type: 'modalidade' | 'estrutura' | null;
  onClose: () => void;
  onSelect: (option: string) => void;
  selectedFilters: string[];
}

const ModalExplore: React.FC<ModalProps> = ({ 
  visible, 
  type, 
  onClose, 
  onSelect, 
  selectedFilters 
}) => {

 const options: Record<'modalidade' | 'estrutura', string[]> = {
  modalidade: ['Street', 'Park', 'Vert'],
  estrutura: ['Corrimão', 'Bank', 'Half Pipe', 'Bowl']
};

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {type === 'modalidade' ? 'Modalidade' : 'Estrutura'}
          </Text>
          
          <ScrollView contentContainerStyle={styles.modalOptions}>
            {type && options[type].map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.modalOption,
                  selectedFilters.includes(option) && styles.modalOptionSelected
                ]}
                onPress={() => onSelect(option)}
              >
                <Text style={styles.modalOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseText}>Fechar</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
  },
  modalTitle: {
    color: '#F5D907',
    fontSize: 18,
    fontFamily: "Quicksand-Bold",
    marginBottom: 15,
    textAlign: 'center',
  },
  modalOptions: {
    paddingBottom: 15,
  },
  modalOption: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#1e1e1e',
  },
  modalOptionSelected: {
    backgroundColor: '#9747FF',
  },
  modalOptionText: {
    color: '#fff',
    fontFamily: "Quicksand-Regular",
    textAlign: 'center',
  },
  modalCloseButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
  },
  modalCloseText: {
    color: '#F5D907',
    textAlign: 'center',
    fontFamily: "Quicksand-Bold",
  },
});

export default ModalExplore;
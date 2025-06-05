import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Rating {
  id: number;
  rating_structures: number;
  rating_location: number;
  rating_spot: number;
  create_date: string;
}

interface RatingCardProps {
  rating: Rating;
  onDelete: (id: number) => void;
}

const RatingCard: React.FC<RatingCardProps> = ({ rating, onDelete }) => {
  const formattedDate = format(new Date(rating.create_date), "dd/MM/yyyy", { locale: ptBR });
  
  return (
    <View style={styles.card}>
      <View style={styles.ratingRow}>
        <Text style={styles.label}>Estruturas:</Text>
        <Text style={styles.value}>{rating.rating_structures}/5</Text>
      </View>
      
      <View style={styles.ratingRow}>
        <Text style={styles.label}>Localização:</Text>
        <Text style={styles.value}>{rating.rating_location}/5</Text>
      </View>
      
      <View style={styles.ratingRow}>
        <Text style={styles.label}>Pista:</Text>
        <Text style={styles.value}>{rating.rating_spot}/5</Text>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.date}>{formattedDate}</Text>
        <TouchableOpacity onPress={() => onDelete(rating.id)}>
          <Icon name="trash-2" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    color: '#F5D907',
    fontFamily: 'Quicksand-Regular',
    fontSize: 14,
  },
  value: {
    color: '#FFFFFF',
    fontFamily: 'Quicksand-Bold',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 8,
  },
  date: {
    color: '#AAAAAA',
    fontFamily: 'Quicksand-Regular',
    fontSize: 12,
  },
});

export default RatingCard;
import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface StarRatingProps {
  rating: number;
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, size = 20 }) => {
  const fullStars = Math.floor(rating);
  const hasPartial = rating - fullStars > 0;
  const partialPercent = rating - fullStars;

  // Cor com base no rating
  let color = '#FFD700'; // padrão: amarelo
  if (rating < 3) color = '#FF3B30';       // vermelho
  else if (rating >= 4) color = '#34C759'; // verde


  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Icon key={`full-${i}`} name="star" size={size} color={color} />
    );
  }

  if (hasPartial && stars.length < 5) {
    stars.push(
      <View key="partial" style={{ position: "relative", width: size, height: size }}>
        <Icon name="star-o" size={size} color={color} style={{ position: "absolute" }} />
        <Icon name="star" size={size} color={color} style={{
          width: size * partialPercent,
          overflow: "hidden",
          position: "absolute"
        }} />
      </View>
    );
  }

  while (stars.length < 5) {
    stars.push(
      <Icon key={`empty-${stars.length}`} name="star-o" size={size} color={color} />
    );
  }

  return (
    <View style={{ flexDirection: "row" }}>
      {stars}
    </View>
  );
};

export default StarRating;

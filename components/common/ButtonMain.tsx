import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ButtonMainProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const ButtonMain: React.FC<ButtonMainProps> = ({ 
  title, 
  onPress, 
  style,
  textStyle
}) => {
  return (
    <TouchableOpacity 
      style={[styles.button, style]}
      onPress={onPress}
    >
      <Text style={[styles.textButton, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#9747FF',
    borderRadius: 8,
    paddingHorizontal: 42,
    paddingVertical: 8,
  },
  textButton: {
    color: '#fff',
    fontFamily: 'Quicksand-Bold',
    fontSize: 22,
    lineHeight: 27.5,
    letterSpacing: 0.11,
    textAlign: 'center',
  },
});
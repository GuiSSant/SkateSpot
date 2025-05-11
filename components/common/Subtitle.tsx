import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';

interface SubtitleProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export const Subtitle: React.FC<SubtitleProps> = ({ children, style }) => {
  return (
    <Text style={[styles.subtitle, style]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    color: '#fff',
    fontFamily: 'Quicksand-Regular',
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 28,
    marginBottom: 24,
  },
});
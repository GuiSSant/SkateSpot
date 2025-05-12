import React from 'react';
import { Image, StyleSheet, ViewStyle, ImageStyle } from 'react-native';

interface LogoProps {
  style?: ViewStyle;
  imageStyle?: ImageStyle;
}

export const Logo: React.FC<LogoProps> = ({ style, imageStyle }) => {
  return (
    <Image
      source={require('../../../assets/images/logo.png')}
      style={[styles.logo, imageStyle]}
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    height: 109,
    resizeMode: 'contain',
    marginTop: 16,
  },
});
import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  Image, 
  StyleSheet, 
  ViewStyle, 
  TextStyle,
  ImageSourcePropType
} from 'react-native';

interface ButtonMidiaSocialProps {
  icon: ImageSourcePropType;
  title: string;
  onPress?: () => void;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  iconStyle?: ViewStyle;
}

export const ButtonMidiaSocial: React.FC<ButtonMidiaSocialProps> = ({ 
  icon, 
  title, 
  onPress,
  buttonStyle,
  textStyle,
  iconStyle
}) => {
  return (
    <TouchableOpacity 
      style={[styles.button, buttonStyle]}
      onPress={onPress}
    >
      <Image source={icon} style={[styles.icon]} />
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#262626B2',
    paddingHorizontal: 42,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  text: {
    fontFamily: 'Quicksand-Regular',
  },
});

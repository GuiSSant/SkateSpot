import { useColorScheme } from "react-native";

export const useTheme = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  return {
    isDarkMode,
    background: isDarkMode ? "#1C1C1E" : "#FFFFFF",
    cardBackground: isDarkMode ? "#2C2C2E" : "#F5F5F5",
    primaryText: isDarkMode ? "#FFFFFF" : "#212121",
    secondaryText: isDarkMode ? "#BBBBBB" : "#888888",
    highlight: isDarkMode ? "#F5D907" : "#FFD700",
    chipBackground: isDarkMode ? "#333333" : "#E0E0E0",
    chipText: isDarkMode ? "#FFFFFF" : "#212121",
  };
};
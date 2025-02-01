import { Stack } from "expo-router";

export type RootStackParamList = {
  Explore: { newLocation?: { latitude: number; longitude: number } };
  LocationSearch: undefined;
  LocalDetails: {
    id: number;
    name: string;
    type: string;
    latitude: number;
    longitude: number;
    main_image: string;
    distance: number;
    description: string;
    images: string;
  }
};

export default function RootLayout() {
  return <Stack
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen name="index" options={{ title: 'Index' }} />
    <Stack.Screen name="OnBoarding" options={{ title: 'OnBoarding' }} />
    <Stack.Screen name="home" options={{ title: 'Home' }} />
    <Stack.Screen name="Cadastro" options={{title: 'Cadastro'}}/>
    <Stack.Screen name="UserProfile" options={{title: 'UserProfile'}}/>
    <Stack.Screen name="Explore" options={{ title: "Explore" }} />
    <Stack.Screen name="LocationSearch" options={{ title: "Buscar Localização" }} />
    <Stack.Screen name="LocalDetails" options={{ title: "Detalhes do Local" }} />
  </Stack>
}

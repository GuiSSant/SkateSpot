import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen name="index" options={{ title: 'Index' }} />
    <Stack.Screen name="OnBoarding" options={{ title: 'OnBoarding' }} />
    <Stack.Screen name="home" options={{ title: 'Home' }} />
    <Stack.Screen name="Cadastro" options={{title: 'Cadastro'}}/>

  </Stack>
}

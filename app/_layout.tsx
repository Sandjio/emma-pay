import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      <Stack.Screen name="log-in" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="top-up" options={{ headerShown: false }} />
      <Stack.Screen name="withdraw" options={{ headerShown: false }} />
      <Stack.Screen name="send" options={{ headerShown: false }} />
      <Stack.Screen
        name="success"
        options={{ headerShown: false, presentation: "modal" }}
      />
      <Stack.Screen name="new-virtual-card" options={{ headerShown: false }} />
      <Stack.Screen
        name="order-physical-card"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="card-details" options={{ headerShown: false }} />
      <Stack.Screen name="link-bank" options={{ headerShown: false }} />
    </Stack>
  );
}

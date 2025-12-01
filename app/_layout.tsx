import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { MessagesProvider } from "./context/MessagesContext";

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {

  return (

   <MessagesProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
  </MessagesProvider>
  );
}

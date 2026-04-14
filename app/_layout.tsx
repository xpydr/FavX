import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { View, ActivityIndicator } from "react-native";

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="favour/[id]" />
          <Stack.Screen name="edit-profile" />
          <Stack.Screen name="change-password" />
          <Stack.Screen name="language" />
        </>
      ) : (
        <>
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
        </>
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <>
      <AuthProvider>
        <Stack>
          <RootNavigator />
        </Stack>
      </AuthProvider>
      <StatusBar style="auto" />
    </>
  );
}

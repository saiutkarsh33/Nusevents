import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/auth";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}

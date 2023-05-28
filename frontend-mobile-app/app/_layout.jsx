import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/auth";
import { PaperProvider } from "react-native-paper";

const customTheme = {
  colors: {
    background: "white",
  },
};

export default function RootLayout() {
  return (
    <PaperProvider theme={customTheme}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </PaperProvider>
  );
}

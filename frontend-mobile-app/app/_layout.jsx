import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/auth";
import { Provider } from "react-native-paper";

const customTheme = {
  colors: {
    background: "white",
  },
};

export default function RootLayout() {
  return (
    <Provider theme={customTheme}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </Provider>
  );
}

import { Stack } from "expo-router";
export const unstable_settings = {
  initialRouteName: "login",
};

export default function AuthRoot() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ title: "Sign in" }} />
      <Stack.Screen name="register" options={{ title: "Sign up" }} />
    </Stack>
  );
}

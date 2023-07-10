import { Stack } from "expo-router";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";

export const unstable_settings = {
  initialRouteName: "login",
};

export default function AuthRoot() {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen name="login" options={{ title: "Sign in" }} />
      <Stack.Screen
        name="register"
        options={{
          title: "Sign up",
          headerLeft: () => (
            <Button mode="contained" onPress={() => router.replace("/login")}>
              Back
            </Button>
          ),
        }}
      />
    </Stack>
  );
}

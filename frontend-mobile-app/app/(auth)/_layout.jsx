import { Stack } from "expo-router";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";

export const unstable_settings = {
  initialRouteName: "login",
};

// This is our layout for login and signup page, follows stack screen.


export default function AuthRoot() {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen name="login" options={{ title: "Sign in", headerStyle: {
            backgroundColor: 'cyan',
          }, }} />
      <Stack.Screen
        name="register"
        options={{
          title: "Sign up",
          headerStyle: {
            backgroundColor: 'cyan',
          },
          headerLeft: () => (
            <Button
              mode="contained"
              onPress={() => router.replace("/login")}
              style={{ marginBottom: 100 }} 
              contentStyle={{ paddingHorizontal: 4, paddingVertical: 2 }} 
              labelStyle={{ fontWeight: 'bold', fontSize: 16 }} 
            >
              Back
            </Button>
          ),
        }}
      />
    </Stack>
  );
}

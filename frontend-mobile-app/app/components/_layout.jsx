import { Stack } from "expo-router";
import { View, Text } from "react-native";


export default function RootLayout() {
  return (
        <View>
          <Stack.Screen options={{ headerShown: true }} />
          <Text>
            join us
          </Text>
        </View>
  )
}
import { Tabs } from "expo-router";

export default function HomeScreen() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Todos" }} />
      <Tabs.Screen name="newTodo" options={{ title: "New Todo" }} />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

import { Tabs } from "expo-router";

export default function HomeScreen() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="createEvents" options={{ title: "Create Events" }} />
      <Tabs.Screen name="profile" options={{ title: "Settings" }} />
      <Tabs.Screen name="myEvents" options={{ title: "My Events" }} />
    </Tabs>
  );
}


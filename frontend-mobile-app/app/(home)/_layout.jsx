import { Tabs } from "expo-router";

export default function HomeScreen() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Todos" }} />
      <Tabs.Screen name="newTodo" options={{ title: "New Todo" }} />
      <Tabs.Screen name="createEvents" options={{ title: "Create Events" }} />
      <Tabs.Screen name="eventsPage" options={{ title: "View Events" }} />
      <Tabs.Screen name="eventsCalendar" options={{ title: "My Calendar" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}

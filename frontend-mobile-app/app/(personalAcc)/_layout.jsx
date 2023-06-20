import { Tabs } from "expo-router";

export default function HomeScreen() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "View Events" }} />
      <Tabs.Screen name="eventsCalendar" options={{ title: "My Calendar" }} />
      <Tabs.Screen
        name="businessAccounts"
        options={{ title: "View CCAs" }}
      />
      <Tabs.Screen name="profile" options={{ title: "Settings" }} />
    </Tabs>
  );
}

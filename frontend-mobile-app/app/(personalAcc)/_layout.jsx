import { Tabs } from "expo-router";
import { PaperProvider } from "react-native-paper";

const customTheme = {
  colors: {
    background: "white",
  },
};

export default function HomeScreen() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="createEvents" options={{ title: "Create Events" }} />
      <Tabs.Screen name="eventsPage" options={{ title: "View Events" }} />
      <Tabs.Screen name="eventsCalendar" options={{ title: "My Calendar" }} />
      <Tabs.Screen name="profile" options={{ title: "Settings" }} />
    </Tabs>
  );
}

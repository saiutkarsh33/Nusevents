import { Tabs } from "expo-router";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';



export default function HomeScreen() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "View Events", tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="home" color={color} size={size} />
        ), }} />
      <Tabs.Screen name="eventsCalendar" options={{ title: "My Calendar", tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="calendar" color={color} size={size} />
        ), }} />
      <Tabs.Screen
        name="businessAccounts"
        options={{ title: "View CCAs", tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="magnify" color={color} size={size} />
        ), }}
      />
      <Tabs.Screen name="profile" options={{ title: "Settings", tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="tools" color={color} size={size} />
        ), }} />
    </Tabs>
  );
}

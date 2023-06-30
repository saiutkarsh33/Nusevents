import { Tabs } from "expo-router";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function HomeScreen() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{ title: "My Events", tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="home" color={color} size={size} />
        ),}}
      />
      <Tabs.Screen
        name="createEvents"
        options={{ title: "Create Events", tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="clipboard-edit" color={color} size={size} />
        ),}}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile", tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="account" color={color} size={size} />
        ),}}
      />
    </Tabs>
  );
}

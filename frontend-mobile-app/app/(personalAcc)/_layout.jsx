import { Tabs } from "expo-router";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// Layout for personal account's screens , using tabs. Used material community icons for the page icons.

export default function HomeScreen() {
  return (
    <Tabs
    screenOptions={{
      tabBarActiveTintColor: 'blue',
      tabBarInactiveTintColor: 'black',
      
    }}
  >
      <Tabs.Screen
        name="index"
        options={{
          title: "View Events",
          headerStyle: {
            backgroundColor: 'skyblue',  // Set the header background color
          },
          headerTitleAlign: 'center',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="eventsCalendar"
        options={{
          title: "My Calendar",
          headerStyle: {
            backgroundColor: 'skyblue',  // Set the header background color
          },
          headerTitleAlign: 'center',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="businessAccounts"
        options={{
          title: "View CCAs",
          headerStyle: {
            backgroundColor: 'skyblue',  // Set the header background color
          },
          headerTitleAlign: 'center',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="magnify" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Settings",
          headerStyle: {
            backgroundColor: 'skyblue',  // Set the header background color
          },
          headerTitleAlign: 'center',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

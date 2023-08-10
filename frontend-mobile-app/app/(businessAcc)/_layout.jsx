import { Tabs } from "expo-router";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Layout for Business Account, using tabs. Used material community icons for the page icons.

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
        options={{ title: "My Events", 
        headerStyle: {
          backgroundColor: 'lightgreen',  // Set the header background color
        },
        headerTitleAlign: 'center',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="home" color={color} size={size} />
        ),}}
      />
      <Tabs.Screen
        name="createEvents"
        options={{ title: "Create Events", headerStyle: {
          backgroundColor: 'lightgreen', 
           // Set the header background color
        },
        headerTitleAlign: 'center',
         tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="clipboard-edit" color={color} size={size} />
        ),}}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile", headerStyle: {
          backgroundColor: 'lightgreen',
           // Set the header background color
        },
        headerTitleAlign: 'center',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="account" color={color} size={size} />
        ),}}
      />
    </Tabs>
  );
}

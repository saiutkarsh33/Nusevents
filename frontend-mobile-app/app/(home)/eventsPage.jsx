import { View, StatusBar, TouchableOpacity, Stylesheet } from "react-native";
import { supabase } from "../../lib/supabase";
import { Avatar, Button, Card, Text } from "react-native-paper";
import { Link } from "expo-router";

export default function ProfileScreen() {
  return (
    <Card>
      <Card.Content>
        <Text variant="titleLarge">TFAMILY CHALET</Text>
        <Text variant="bodyMedium">Time: All Day • Venue: Everywhere </Text>
      </Card.Content>

      <TouchableOpacity>
        <Card.Cover
          source={require("frontend-mobile-app/assets/tfamily.jpg")}
        />
      </TouchableOpacity>

      <TouchableOpacity>
        <Card.Actions>
          <Button>I&apos;m in</Button>
          <Link href="../components/eventsDesc">
            <Button>View More </Button>
          </Link>
        </Card.Actions>
      </TouchableOpacity>
    </Card>
  );
}

// <Card.Cover source={{ uri: "file:///Users/saiutkarsh33/Desktop/Nusevents/frontend-mobile-app/assets/tfamily.jpg" }} />

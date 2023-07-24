import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from "react-native";
import {
  Button,
  Card,
  Text,
  ActivityIndicator,
  Switch,
  Avatar,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: "20%",
    paddingHorizontal: "5%",
  },
  cardContainer: {
    // borderRadius: 0,
    margin: 10,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 22,
    marginVertical: 10,
  },

  eventDescCard: {
    marginTop: 30,
  },

  eventDescContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  fullImage: {
    width: "100%",
    height: "30%",
  },

  Text: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    marginVertical: 10,
  },

  Button: {
    marginTop: 16,
    backgroundColor: "cyan",
    alignSelf: "center",
  },
});

// This is the card of each Business Account's profile, simplified for testing

function EventCard(props) {
  const [modalEventsVisible, setModalEventsVisible] = useState(false);
  const [followedButton, setFollowedButton] = useState(false);

  const handleViewEventsPress = async () => {
    setModalEventsVisible(true);
  };

  const handleCloseEventsModal = () => {
    setModalEventsVisible(false);
  };

  // If followed, will add to the user's followed array. Using this, the user can only view the events from accounts followed.

  const handleFollowPress = async () => {
    setFollowedButton(!followedButton);
  };

  return (
    <>
      <Card style={styles.cardContainer} mode="outlined">
        <Card.Title title={props.name} titleStyle={styles.cardTitle} />

        <TouchableOpacity>
          <Card.Actions>
            {followedButton ? <Text>Following</Text> : <Text>Follow</Text>}
            <Switch
              value={followedButton}
              onValueChange={handleFollowPress}
              testID="followSwitch"
            />
            <Button
              onPress={handleViewEventsPress}
              mode={"outlined"}
              style={{ backgroundColor: "cyan", marginLeft: 10 }}
            >
              Learn More
            </Button>
          </Card.Actions>
        </TouchableOpacity>
      </Card>

      <Modal
        visible={modalEventsVisible}
        animationType="slide"
        onRequestClose={handleCloseEventsModal}
        contentContainerStyle={{ height: Dimensions.get("window").height }}
      >
        <SafeAreaView style={styles.modalContainer}>
          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
              alignSelf: "flex-start",
              marginBottom: 20,
            }}
          >
            {props.name}
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              alignSelf: "flex-start",
              marginTop: 10,
            }}
          >
            Description
          </Text>
          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
              textDecorationLine: "underline",
              alignSelf: "flex-start",
              marginTop: 20,
            }}
          >
            Events
          </Text>

          <Button onPress={handleCloseEventsModal} style={styles.Button}>
            Back
          </Button>
        </SafeAreaView>
      </Modal>
    </>
  );
}
// Simplified BusinessAccounts, for testing purposes,

export function BusinessAccounts() {
  const card = {
    id: "1",
    name: "Test CCA",
  };

  return (
    <ScrollView>
      <EventCard key={card.id} id={card.id} name={card.name} />
    </ScrollView>
  );
}

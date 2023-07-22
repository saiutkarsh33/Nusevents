import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import {
  Button,
  Card,
  Text,
  ActivityIndicator,
  Avatar,
  Switch,
  TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/auth";

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: "20%",
    paddingHorizontal: "5%",
    paddingBottom: 100,
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
  eventCardName: {
    fontWeight: "bold",
    fontSize: 22,
    marginVertical: 10,
  },
  eventCardDate: {
    color: "red",
  },
  eventDescCard: {
    marginTop: 30,
    width: "100%",
  },

  eventDescContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  fullImage: {
    width: "100%",
    height: "30%",
  },

  closeButtonImage: {
    marginTop: 30,
    backgroundColor: "cyan",
  },

  closeButton: {
    marginTop: 16,
    backgroundColor: "cyan",
    alignSelf: "center",
  },
  noEventsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    width: "100%",
  },

  noEventsText: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    marginVertical: 10,
  },

  messageContainer: {
    padding: 10,
    marginVertical: 5,
    maxWidth: "80%",
    borderRadius: 15,
  },
  senderMessage: {
    alignSelf: "flex-end",
    backgroundColor: "cyan",
  },
  receiverMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#ECECEC",
  },
  senderText: {
    color: "black",
  },
  receiverText: {
    color: "black",
  },

  creatorMessage: {
    alignSelf: "flex-start",
    backgroundColor: "yellow",
    borderWidth: 1,
    borderColor: "#ECECEC",
  },

  nameText: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "black",
  },
  creatorText: {
    color: "black",
  },
});

// This is the event card itself

export function TheirCard(props) {
  // const [picVisible, setPicVisible] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [chatModalVisible, setChatModalVisible] = useState(false);

  const handleViewMorePress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <Card style={styles.cardContainer} mode="outlined">
        <View testID="creatorName">
          <Card.Title title={props.creator} titleStyle={styles.cardTitle} />
        </View>
        <View testID="eventName">
          <Card.Content>
            <Text style={styles.eventCardName}>{props.name}</Text>
          </Card.Content>
        </View>
        <TouchableOpacity>
          <Card.Actions>
            <Button
              onPress={handleViewMorePress}
              mode="outlined"
              style={{ backgroundColor: "cyan", marginLeft: 10 }}
            >
              Learn More
            </Button>
            <Button
              onPress={() => setChatModalVisible(true)}
              mode="outlined"
              style={{ backgroundColor: "cyan", marginLeft: 10 }}
            >
              Chat
            </Button>
          </Card.Actions>
        </TouchableOpacity>
      </Card>

      <EventLearnMoreModal
        modalVisible={modalVisible}
        handleCloseModal={handleCloseModal}
        props={props}
      />

      <Modal
        visible={chatModalVisible}
        animationType="slide"
        onRequestClose={() => setChatModalVisible(false)}
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
            Event Chat
          </Text>
        </SafeAreaView>
      </Modal>
    </>
  );
}

// This is the modal to learn more about the event

export function EventLearnMoreModal({ modalVisible, handleCloseModal, props }) {
  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      onRequestClose={handleCloseModal}
      style={styles.modalContainer}
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
        <Card style={styles.eventDescCard} mode="outlined">
          <Card.Title title="Event Description" titleStyle={styles.cardTitle} />
          <Card.Content>
            <View style={styles.eventDescContainer}>
              <Avatar.Icon size={40} icon="account" color="#6c8aff" />
              <Text variant="bodyLarge">{props.creator}</Text>
            </View>
          </Card.Content>
        </Card>
        <Button onPress={handleCloseModal} style={styles.closeButton}>
          Close
        </Button>
      </SafeAreaView>
    </Modal>
  );
}

export function EventsPage() {
  const card = {
    id: "1",
    creator: "Test CCA",
    name: "Test Event Name",
  };

  return (
    <ScrollView>
      <TheirCard
        key={card.id}
        id={card.id}
        creator={card.creator}
        name={card.name}
      />
    </ScrollView>
  );
}

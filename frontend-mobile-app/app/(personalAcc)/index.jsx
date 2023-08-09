import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
  RefreshControl,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { supabase } from "../../lib/supabase";
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
    color: "#006666",
    fontWeight: "600",
    marginBottom: 5,
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
  smallChatGreyText: {
    fontSize: 16,
    color: 'grey',
    paddingLeft: -30, // adjust the value as needed
    paddingRight: -10,
},
sendButton: {
  marginTop: 16,
  backgroundColor: "lightgrey",
  alignSelf: "center",
},
smallGreyText: {
  fontSize: 16,
  color: 'grey',
  paddingLeft: 14, // adjust the value as needed
  paddingRight: 0,
  paddingTop: 10,
},
noEventsText: {
  fontWeight: "bold",
  fontSize: 18,
  textAlign: "center",
  marginVertical: 10,
}, 
});

// This is the event card itself

export function TheirCard(props) {
  // const [picVisible, setPicVisible] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedButton, setSelectedButton] = useState(() => props.selected);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [eventId, setEventId] = useState(props.id);
  const [myName, setMyName] = useState(null);
  

  const { user } = useAuth();

  /// get user's name

  const fetchName = async () => {
    console.log("User:", user);
    console.log("User ID:", user?.id);

    const { data, error } = await supabase
      .from("users")
      .select("name")
      .eq("id", user?.id);

    if (error) {
      console.error("Error fetching name:", error);
    } else {
      setMyName(data[0].name);
      console.log("My Name:", myName);
    }
  };

  useEffect(() => {
    fetchName();
  }, [myName]);

  // get all messages associated with the event

  async function getAllMessages() {
    return await supabase.from("messages").select("*").eq("event_id", eventId);
  }



  const fetchMessages = async () => {
    if (!user || !user.id) {
      // User is not logged in, skip fetching messages
      return;
    }
  
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("event_id", eventId)
      .order('created_at', { ascending: true });
  
    if (error) {
      console.error("Error fetching messages2: ", error);
    } else {
      setMessages(data);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [eventId, messages]);

  // add the message created to supabase's database

  async function handleSendMessage() {
    // Trim the message to remove leading/trailing whitespace, then check if it's empty
    if (newMessage.trim() === "") {
      return; // Exit early if the message is empty
    }
  
    const { error } = await supabase.from("messages").insert([
      {
        event_id: eventId,
        user_id: user.id,
        content: newMessage,
        name: myName,
      },
    ]);
  
    if (error) {
      console.error("Error updating message:", error);
    } else {
      setNewMessage("");
      console.log("this is message", newMessage);
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: newMessage, name: myName, user_id: user.id },
      ]);
      await fetchMessages();
      console.log(messages);
    }
  }
  

  

  const handleViewMorePress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  // When an event is joined, event is added to user's selected event array and user's name is added to the event's signup array

  const handleImInPress = async () => {
    console.log("pressed");
    console.log(props.id);

    setSelectedButton(prevState => !prevState);

    try {
      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select("signups")
        .eq("id", props.id)
        .single();

      if (eventError) {
        console.error("Error fetching event:", eventError);
        return;
      } else {
        console.log("event fetched");
        console.log("this is eventdata before the change :", eventData);
      }

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (userError) {
        console.error("Error fetching Account:", userError);
        return;
      } else {
        console.log("user fetched");
        console.log("this is user data before the change: ", userData);
      }

      const signups = eventData.signups;

      const selected = userData.selected_events;

      let updatedSignups;
      let updatedSelected;

      if (selected.includes(props.name)) {
        // Remove event from user's selected events
        updatedSelected = selected.filter(
          (eventName) => eventName !== props.name
        );

        // Remove user from event signups
        updatedSignups = signups.filter((signup) => signup !== userData.name);
      } else {
        // Add event to user's selected events
        updatedSelected = [...selected, props.name];

        // Add user to event signups
        updatedSignups = [...signups, userData.name];
      }

      console.log("this is updated signup", props.name, updatedSignups);

      const { data: updatedEventData, error: updateEventError } = await supabase
        .from("events")
        .update({
          signups: updatedSignups,
        })
        .eq("id", props.id)
        .select();

      console.log("this is updated data", props.name, updatedEventData);

      if (updateEventError) {
        console.error("Error updating event:", updateEventError);
      } else {
        console.log(
          "this is signups after change",
          props.name,
          updatedEventData[0].signups
        );
      }

      const { data: updatedUserData, error: updateUserError } = await supabase
        .from("users")
        .update({
          selected_events: updatedSelected,
        })
        .eq("id", user.id)
        .select();

      if (updateUserError) {
        console.error("Error updating users:", updateUserError);
      } else {
        
        props.selected = selectedButton;
      }

      console.log("this is final selected", selectedButton);
    } catch (error) {
      setSelectedButton(prevState => !prevState);
      console.error("Error updating event:", error);
    }
  };

  return (
    <>
      <Card style={styles.cardContainer} mode="contained">
        <Card.Title title={props.creator} titleStyle={styles.cardTitle} />
        {props.image_url ? (
          <Card.Cover
            style={styles.cardCover}
            source={{ uri: props.image_url }}
            theme={{
              roundness: 4,
              isV3: false,
            }}
          />
        ) : (
          <View style={{ backgroundColor: "#F0F0F0", paddingVertical: 35 }}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 18,
                textAlign: "center",
              }}
            >
              No Image
            </Text>
          </View>
        )}
        <Card.Content>
          <Text style={styles.eventCardName}>{props.name}</Text>
          <Text style={styles.eventCardDate}>Date: {props.date}</Text>
          <Text style={styles.eventCardDate}>Time: {props.time}</Text>
        </Card.Content>

        <TouchableOpacity>
          <Card.Actions>
            {selectedButton ? <Text>Joined</Text> : <Text>Join</Text>}
            <Switch value={selectedButton} onValueChange={handleImInPress} />
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

          < Text style={styles.smallChatGreyText}>
          Chat with {props.creator} and other students in your residency!
        </Text>

          {Platform.OS === "ios" ? (
            <KeyboardAvoidingView behavior="padding" style={styles.container}>
              <ScrollView keyboardShouldPersistTaps="handled">
                {messages.map((message, index) => {
                  return (
                    <View
                      key={index}
                      style={[
                        styles.messageContainer,
                        user && message.user_id === user.id
                          ? styles.senderMessage
                          : message.name === props.creator
                          ? styles.creatorMessage
                          : styles.receiverMessage,
                      ]}
                    >
                      {user && message.user_id !== user.id && (
                        <Text style={styles.nameText}>{message.name}</Text>
                      )}
                      <Text
                        style={
                          user && message.user_id === user.id
                            ? styles.senderText
                            : message.name === props.creator
                            ? styles.creatorText
                            : styles.receiverText
                        }
                      >
                        {message.content}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>

              <TextInput
                style={{
                  height: 40,
                  borderColor: "gray",
                  borderWidth: 1,
                  borderRadius: 10,
                }}
                onChangeText={setNewMessage}
                value={newMessage}
                multiline={true}
                //numberOfLines={4}
                onSubmitEditing={handleSendMessage}
              />


              <Button onPress={handleSendMessage} style={styles.sendButton}>
                Send
              </Button>

              <Button
                onPress={() => setChatModalVisible(false)}
                style={styles.closeButton}
              >
                Close
              </Button>
            </KeyboardAvoidingView>
          ) : (
            <View style={styles.container} behavior="padding">
              <ScrollView keyboardShouldPersistTaps="handled">
                {messages.map((message, index) => {
                  return (
                    <View
                      key={index}
                      style={[
                        styles.messageContainer,
                        user && message.user_id === user.id
                          ? styles.senderMessage
                          : message.name === props.creator
                          ? styles.creatorMessage
                          : styles.receiverMessage,
                      ]}
                    >
                      {user && message.user_id !== user.id && (
                        <Text style={styles.nameText}>{message.name}</Text>
                      )}
                      <Text
                        style={
                          user && message.user_id === user.id
                            ? styles.senderText
                            : message.name === props.creator
                            ? styles.creatorText
                            : styles.receiverText
                        }
                      >
                        {message.content}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>

              <TextInput
                style={{
                  height: 60,
                  borderColor: "gray",
                  borderWidth: 1,
                  borderRadius: 10,
                }}
                onChangeText={setNewMessage}
                value={newMessage}
                multiline={true}
                numberOfLines={4}
                onSubmitEditing={handleSendMessage}
              />

              <Button onPress={handleSendMessage} style={styles.sendButton}>
                Send
              </Button>

              <Button
                onPress={() => setChatModalVisible(false)}
                style={styles.closeButton}
              >
                Close
              </Button>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </>
  );
}

// This is the modal to learn more about the event

function EventLearnMoreModal({ modalVisible, handleCloseModal, props }) {
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
        {props.image_url && (
          <Image
            source={{ uri: props.image_url }}
            style={styles.fullImage}
            resizeMode="contain"
          />
        )}
        <Card style={styles.eventDescCard} mode="outlined">
          <Card.Title title="Event Description" titleStyle={styles.cardTitle} />
          <Card.Content>
            <View style={styles.eventDescContainer}>
              <Avatar.Icon size={40} icon="account" color="#6c8aff" />
              <Text variant="bodyLarge">{props.creator}</Text>
            </View>
            <View style={styles.eventDescContainer}>
              <Avatar.Icon size={40} icon="calendar" color="#6c8aff" />
              <Text variant="bodyLarge">{props.date}</Text>
            </View>
            <View style={styles.eventDescContainer}>
              <Avatar.Icon size={40} icon="clock" color="#6c8aff" />
              <Text variant="bodyLarge">{props.time}</Text>
            </View>
            <View style={styles.eventDescContainer}>
              <Avatar.Icon size={40} icon="map-marker" color="#6c8aff" />
              <Text variant="bodyLarge">{props.venue}</Text>
            </View>
            <Text variant="bodyLarge" style={{ marginVertical: 10 }}>
              {props.desc}
            </Text>
          </Card.Content>
        </Card>
        <Button onPress={handleCloseModal} style={styles.closeButton}>
          Close
        </Button>
      </SafeAreaView>
    </Modal>
  );
}


export default function EventsPage() {
  const [eventsData, setEventsData] = useState([]);
  const [residence, setResidence] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const [userData, setUserData] = useState(null);
  const [followed, setFollowed] = useState([]);

  // Get data of all the events in residence, created by business accounts whom user follows

  async function fetchAllData() {
    if (!user) return;
  
    setLoading(true);
  
    try {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();
  
      if (userError) {
        console.error("Error fetching user data:", userError);
        return;
      }
  
      const { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .select("*")
        .eq("residence", userData.residence)
        .in("creator", userData.following);
  
      if (eventsError) {
        console.error("Error fetching events:", eventsError);
        return;
      }
  
      setEventsData(eventsData);
      setResidence(userData.residence);
      setFollowed(userData.following);
      setUserData(userData);
  
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }
  
  useEffect(() => {
    fetchAllData();
  }, [user]);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
  };

  if (!userData) {
    return <Text style={styles.noEventsText} >Loading account data...</Text>;
  }

  // Sorted the events based on Date

  const sortedEventsData = eventsData.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Returning the event cards themselves

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, backgroundColor: "white" }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      < Text style={styles.smallGreyText}>
          View all the Events created by Business Accounts you follow!
        </Text>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : sortedEventsData.length > 0 ? (
        sortedEventsData.map((card) => (
          <TheirCard
            key={card.id}
            id={card.id}
            creator={card.creator}
            name={card.name}
            date={card.date}
            time={card.time}
            venue={card.venue}
            image_url={card.image_url}
            desc={card.description}
            selected={userData.selected_events?.includes(card.name) ?? false}
          />
        ))
      ) : (
        <View style={styles.noEventsContainer}>
          <Text style={styles.noEventsText}>No events found.</Text>
        </View>
      )}
    </ScrollView>
  );
}

import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  FlatList,
  TextInput as NormalTextInput,

} from "react-native";
import { supabase } from "../../lib/supabase";
import {
  Button,
  Card,
  Text,
  ActivityIndicator,
  TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/auth";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: "20%",
    paddingHorizontal: 20,
    paddingBottom: 80,
    
    marginVertical: 10,
    paddingTop: 50,
  },
  totalSignupsText: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 8,
  },
  signupsText: {
    fontSize: 20,
    margin: 10,
  },
  closeButton: {
    width: 150,
    marginTop: 16,
    backgroundColor: "cyan",
  },
  closeButton2: {
    marginTop: 16,
    backgroundColor: "cyan",
    alignSelf: "center",
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
  eventCardVenue: {
    fontWeight: "bold",
    fontSize: 22,
    marginVertical: 10,
  },
  eventCardRed: {
    color: "#006666",
    marginBottom: 5,
    fontWeight: "600"
  },
  editValuesText: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    marginVertical: 10,
  },

  doneButton: {
    marginTop: 16,
    backgroundColor: "cyan",
    alignSelf: "center",
  },

  Text: {
    fontWeight: "bold",
    marginVertical: 10,
  },

  changeEventImage: {
    margin: 16,
    backgroundColor: "white",
    alignSelf: "center",
  },
  deleteButton: {
    marginTop: 16,
    backgroundColor: "#FF3131",
    alignSelf: "center",
  },

  Image: {
    alignSelf: "center",
    width: 200,
    height: 200,
    margin: 10,
  },
  container: {
    flex: 1,
    width: "100%",
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    maxWidth: "80%",
    borderRadius: 15,
    padddingTop:20,
  },
  senderMessage: {
    alignSelf: "flex-end",
    backgroundColor: "yellow",
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

  nameText: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "black",
  },
  sendButton: {
    marginTop: 10,
    color: "black",
  },
  noEventsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noEventsText: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    marginVertical: 10,
  },
  smallGreyText: {
    fontSize: 12,
    color: 'grey'
},
smallCentreGreyText: {
  fontSize: 12,
  color: 'grey',
  textAlign: "center",
},
sendButton: {
  marginTop: 16,
  backgroundColor: "lightgrey",
  alignSelf: "center",
},
smallChatGreyText: {
  fontSize: 16,
  color: 'grey',
  paddingLeft: -30, // adjust the value as needed
  paddingRight: -10,
},
});

// This is the event card of each event created by the business account

function MyCard(props) {
  const [signupVisible, setSignupVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(props.name);
  const [venue, setVenue] = useState(props.venue);
  const [date, setDate] = useState(props.date);
  const [time, setTime] = useState(props.time);
  const [desc, setDesc] = useState(props.desc);
  const [image, setImage] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [eventId, setEventId] = useState(props.id);
  const [changedPicture, setChangedPicture] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [myName, setMyName] = useState(null);
  const { user } = useAuth();

  // get the name of user

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

  // get all the messages tied to the event

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

  // add new message to database

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

  // following 3 functions are to handle opening and closing of modals

  const handleViewSignups = () => {
    setSignupVisible(true);
  };

  const handleCloseSignups = () => {
    setSignupVisible(false);
  };

  const handleEditPress = () => {
    setEditMode(true);
    setEditVisible(true);
  };

  // This is handling the editing of the event - image, description, venue etc

  const handleDonePress = async () => {
    if (user) {
      setLoading(true);
      if (changedPicture) {
        let uploadedImage = null;
        if (image) {
          const { data, error } = await supabase.storage
            .from("images")
            .upload(`${new Date().getTime()}`, {
              uri: image,
              type: "jpg",
              name: "name.jpg",
            });

          if (error) {
            console.log(error);
            setErrMsg(error.message);
            setLoading(false);
            return;
          }
          const {
            data: { publicUrl },
          } = supabase.storage.from("images").getPublicUrl(data.path);
          uploadedImage = publicUrl;
        }
        try {
          // Perform the update in the Supabase table
          const { error } = await supabase
            .from("events")
            .update({
              name: name,
              venue: venue,
              date: date,
              time: time,
              description: desc,
              image_url: uploadedImage,
            })
            .eq("id", props.id);

          if (error) {
            console.error("Error updating event:", error);
          } else {
            console.log("Event updated successfully");
            setEditMode(false);
            setEditVisible(false);
            setChangedPicture(false);
          }
        } catch (error) {
          console.error("Error updating event:", error);
        }
      } else {
        try {
          // Perform the update in the Supabase table
          const { error } = await supabase
            .from("events")
            .update({
              name: name,
              venue: venue,
              date: date,
              time: time,
              description: desc,
            })
            .eq("id", props.id);

          if (error) {
            console.error("Error updating event:", error);
          } else {
            console.log("Event updated successfully");
            setEditMode(false);
            setEditVisible(false);
            setChangedPicture(false);
          }
        } catch (error) {
          console.error("Error updating event:", error);
        }
      }
    }
  };

  // This is handling the deletion of the event

  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this event? This action can't be undone.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Delete cancelled"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            setEditVisible(false);
            deleteEvent();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const deleteEvent = async () => {
    try {
      const { error: eventError } = await supabase
        .from("events")
        .delete()
        .eq("id", props.id);

      if (eventError) {
        console.error("Error deleting event:", eventError);
      } else {
        console.log("Event deleted successfully");
        Alert.alert("Success", "Event deleted successfully");
        // You can update the local state or perform any other necessary actions after deletion
      }

      const { error: messageError } = await supabase
        .from("messages")
        .delete()
        .eq("event_id", props.id);

      if (messageError) {
        console.error("Error deleting messages:", messageError);
      } else {
        console.log("Messages deleted successfully");
        // You can update the local state or perform any other necessary actions after deletion
      }
    } catch (error) {
      console.error("Error deleting event and messages:", error);
    }
  };

  const handleAddProfilePic = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled) {
      console.log(result.assets[0].uri);
      setImage(result.assets[0].uri);
      console.log("result successful", image);
      setChangedPicture(true);
    }
  };

  return (
    <>
      <Card style={styles.cardContainer} mode="contained">
        <Card.Title title={props.name} titleStyle={styles.cardTitle} />
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
          <Text style={styles.eventCardVenue}>{props.venue}</Text>
          <Text style={styles.eventCardRed}>Date: {props.date}</Text>
          <Text style={styles.eventCardRed}>Time: {props.time}</Text>
        </Card.Content>

        <TouchableOpacity>
          <Card.Actions>
            <Button onPress={handleEditPress} mode={"outlined"}>
              Edit
            </Button>

            <Button onPress={handleViewSignups} mode={"outlined"}>
              Signups
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

      <Modal
        visible={editVisible}
        animationType="slide"
        onRequestClose={handleDonePress}
      >
        <KeyboardAwareScrollView>
          <SafeAreaView style={styles.modalContainer}>
            <View>
              <Text style={styles.editValuesText}>
                Edit the values accordingly
              </Text>
              {errMsg !== "" && <Text>{errMsg}</Text>}
              <Button
                onPress={handleAddProfilePic}
                style={styles.changeEventImage}
                mode="outlined"
              >
                Change Event Image
              </Button>
              {image && <Image source={{ uri: image }} style={styles.Image} />}
              <Text style={styles.Text}>Venue: </Text>
              <TextInput
                value={venue}
                onChangeText={setVenue}
                editable={editMode}
                mode="outlined"
              />
              <Text style={styles.smallGreyText}>Ensure that venue is already booked. </Text>
              <Text style={styles.Text}>Date: </Text>
              <TextInput
                value={date}
                onChangeText={setDate}
                editable={editMode}
                mode="outlined"
              />
              <Text style={styles.smallGreyText}> Input in YYYY-MM-DD. </Text>
             
              <Text style={styles.Text}>Time: </Text>
              <TextInput
                value={time}
                onChangeText={setTime}
                editable={editMode}
                mode="outlined"
              />
              <Text style={styles.smallGreyText}>Include both starting and ending time. </Text>
              <Text style={styles.Text}>Description: </Text>
              <TextInput
                value={desc}
                onChangeText={setDesc}
                editable={editMode}
                multiline
                mode="outlined"
              />
               <Text style={styles.smallGreyText}>Please inform those who signed up of the changes, via chat or otherwise. </Text>

              <Button
                onPress={handleDelete}
                mode={"outlined"}
                style={styles.deleteButton}
              >
                Delete Event
              </Button>
              <Text style={styles.smallCentreGreyText}>Please delete event after completion. </Text>

              {editMode && (
                <Button onPress={handleDonePress} style={styles.doneButton}>
                  Done
                </Button>
              )}
            </View>
          </SafeAreaView>
        </KeyboardAwareScrollView>
      </Modal>

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
          Chat with students in your residency about your event!
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
                  height: 60,
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
                style={styles.closeButton2}
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

              <NormalTextInput
                style={{
                  height: 40,
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
                style={styles.closeButton2}
              >
                Close
              </Button>
            </View>
          )}
        </SafeAreaView>
      </Modal>

      <Modal
        visible={signupVisible}
        animationType="slide"
        onRequestClose={handleCloseSignups}
      >
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.totalSignupsText}>
            Total Signups: {props.signups.length}
          </Text>
          <Text
            style={{
              fontSize: 20,
              margin: 20,
              textDecorationLine: "underline",
            }}
          >
            Names
          </Text>
          <FlatList
            data={props.signups}
            renderItem={({ item, index }) => (
              <Text style={styles.signupsText}>
                {index + 1}. {item}
              </Text>
            )}
            style={{ width: "100%" }}
          />
          <Button
            onPress={handleCloseSignups}
            mode="contained"
            style={styles.closeButton}
          >
            Close
          </Button>
        </SafeAreaView>
      </Modal>
    </>
  );
}

export default function MyEvents() {
  const [refreshing, setRefreshing] = useState(false);
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  // Obtaining the events created by user

  async function fetchData() {
    setRefreshing(true);
    setLoading(true);

    if (user) {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error fetching events:", error);
        } else {
          console.log(data);
          setRefreshing(false);
          setEventsData(data);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [user]);

  // fetch the data if refreshed

  useEffect(() => {
    if (refreshing) {
      fetchData();
      setRefreshing(false);
    }
  }, [refreshing]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData(); // Call your fetchData function to fetch the latest data
    setRefreshing(false);
  };

  const sortedEventsData = eventsData.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, backgroundColor: "white" }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : sortedEventsData.length > 0 ? (
        sortedEventsData.map((card) => (
          <MyCard
            key={card.id}
            id={card.id}
            name={card.name}
            date={card.date}
            time={card.time}
            venue={card.venue}
            selected={card.selected}
            image_url={card.image_url}
            desc={card.description}
            signups={card.signups}
          />
        ))
      ) : (
        <View style={styles.noEventsContainer}>
          <Text style={styles.noEventsText}>
            No Current Events Found. Create an event!
          </Text>
        </View>
      )}
    </ScrollView>
  );
  
}

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
} from "react-native";
//import { supabase } from "../../lib/supabase";
import {
  Button,
  Card,
  Text,
  ActivityIndicator,
  TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/auth";
//import * as ImagePicker from "expo-image-picker";
//import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: "20%",
    paddingHorizontal: "5%",
    paddingBottom: 100,
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
    color: "red",
    marginBottom: 5,
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
});

export function MyCard(props) {
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

  const mockUser = {
    id: 1,
    name: "John Doe",
    residence: "San Francisco",
  };

  const fetchName = () => {
    setMyName(mockUser.name);
    console.log("My Name:", myName);
  };

  useEffect(() => {
    fetchName();
  }, [myName]);

  function handleSendMessage() {
    if (newMessage === "") {
      console.error("Message cannot be empty");
      return;
    }
    setNewMessage("");
    console.log("this is message", newMessage);
    setMessages((prevMessages) => [
      ...prevMessages,
      { content: newMessage, name: myName },
    ]);
    console.log(messages);
  }

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

  const handleDonePress = () => {
    if (changedPicture) {
      console.log("Image changed");
    } else {
      console.log("Event updated successfully");
      setEditMode(false);
      setEditVisible(false);
      setChangedPicture(false);
    }
  };

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
            console.log("Event deleted successfully");
          },
        },
      ],
      { cancelable: false }
    );
  };
}

const deleteEvent = () => {
    try {
        // Assume deleting event and messages are successful and print success messages
        console.log("Event deleted successfully");
        Alert.alert("Success", "Event deleted successfully");
        console.log("Messages deleted successfully");
        // You can update the local state or perform any other necessary actions after deletion
    } catch (error) {
        console.error("Error deleting event and messages:", error);
    }
};


const mockProps = {
    name: 'Test Event Name',
    venue: 'Test Venue',
    date: '2023-07-25',
    time: '13:00',
    signups: ["User 1", "User 2", "User 3"],
    creator: "Creator Name",
    id: "mock_id",
  };


  const mockUser = {
    id: "mock_user_id",
  };
  
  const mockMessages = [
    {
      user_id: "mock_user_id",
      name: "Mock User",
      content: "Mock message content",
    },
  ];

  return (
    <>
      <Card style={styles.cardContainer} mode="outlined">
        <Card.Title title={mockProps.name} titleStyle={styles.cardTitle} />
        
         : (
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
        )
  
        <Card.Content>
          <Text style={styles.eventCardVenue}>{mockProps.venue}</Text>
          <Text style={styles.eventCardRed}>Date: {mockProps.date}</Text>
          <Text style={styles.eventCardRed}>Time: {mockProps.time}</Text>
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

      {/* First Modal - Event Edit */}
      <Modal
        visible={editVisible}
        animationType="slide"
        onRequestClose={handleDonePress}
      >
        
          <SafeAreaView style={styles.modalContainer}>
            <View>
            <Text style={styles.editValuesText}>
                Edit the values accordingly
              </Text>
              {errMsg !== "" && <Text>{errMsg}</Text>}
              
              {/* The TextInput value props would be replaced with the corresponding mockData properties */}
              <Text style={styles.Text}>Venue: </Text>
              <TextInput
                value={mockData.venue}
                onChangeText={setVenue}
                editable={editMode}
                mode="outlined"
              />
               <Text style={styles.Text}>Date: </Text>
              <TextInput
                value={date}
                onChangeText={setDate}
                editable={editMode}
                mode="outlined"
              />
              <Text style={styles.Text}>Time: </Text>
              <TextInput
                value={time}
                onChangeText={setTime}
                editable={editMode}
                mode="outlined"
              />
              <Text style={styles.Text}>Description: </Text>
              <TextInput
                value={desc}
                onChangeText={setDesc}
                editable={editMode}
                multiline
                mode="outlined"
              />

              <Button
                onPress={handleDelete}
                mode={"outlined"}
                style={styles.deleteButton}
              >
                Delete Event
              </Button>

              {editMode && (
                <Button onPress={handleDonePress} style={styles.doneButton}>
                  Done
                </Button>
              )}
            </View>
          </SafeAreaView>
        
      </Modal>

      {/* Second Modal - Chat */}
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
      Chat
    </Text>

    
      <ScrollView keyboardShouldPersistTaps="handled">
        {mockData.messages.map((message, index) => {
          return (
            <View
              key={index}
              style={[
                styles.messageContainer,
                user && message.user_id === user.id
                  ? styles.senderMessage
                  : message.name === mockData.creator
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
                    : message.name === mockData.creator
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
    
    
  </SafeAreaView>
</Modal>


      {/* Third Modal - Signups */}
      <Modal
        visible={signupVisible}
        animationType="slide"
        onRequestClose={handleCloseSignups}
      >
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.totalSignupsText}>
            Total Signups: {mockData.signups.length}
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
            data={mockData.signups}
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

  export default function MyEvents() {
  
    return (
      <ScrollView
      >
        
            <MyCard
              key={card.id}
              id={card.id}
              name={card.name}
              date={card.date}
              time={card.time}
              venue={card.venue}
              selected={card.selected}
              desc={card.description}
              signups={card.signups}
            />
      </ScrollView>
    );
  }



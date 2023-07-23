import { useState } from "react";
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
  const [chatModalVisible, setChatModalVisible] = useState(false);
  



  const handleViewSignups = () => {
    setSignupVisible(true);
  };

  const handleCloseSignups = () => {
    setSignupVisible(false);
  };

  const handleEditPress = () => {
    setEditVisible(true);
  };

 
  

  return (
    <>
    
      <Card style={styles.cardContainer} mode="outlined">
      <View testID="eventName">
  <Card.Title title={props.name} titleStyle={styles.cardTitle} />
</View>
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
      >
        
          <SafeAreaView style={styles.modalContainer}>
            <View>
            <Text style={styles.editValuesText}>
                Edit the values accordingly
              </Text>
              <Button
                mode={"outlined"}
                style={styles.deleteButton}
              >
                Delete Event
              </Button>
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
      Event Chat
    </Text>
    

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
            Total Signups
          </Text>
        </SafeAreaView>
      </Modal>
    </>
  );

            }

  export function MyEvents() {

    const card = {
        id: "1",
        name: "Test Event Name",
      };
  
    return (
      <ScrollView
      >
        
            <MyCard
              key={card.id}
              id={card.id}
              name={card.name}
            />
      </ScrollView>
    );
  }



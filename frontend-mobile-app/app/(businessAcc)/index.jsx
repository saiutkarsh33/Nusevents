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

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
  },
  totalSignupsText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  totalSignupsCount: {
    fontWeight: "bold",
    fontSize: 24,
  },
  signupsText: {
    marginBottom: 16,
  },
  closeButton: {
    width: 150,
    marginTop: 16,
    backgroundColor: "cyan",
  },

  cardContainer: {
    backgroundColor: "white", // Add this line to set the background color
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

  changePfpButton: {
    margin: 16,
    backgroundColor: "white",
    alignSelf: "center",
  },

  Image: {
    alignSelf: "center",
    width: 200,
    height: 200,
    margin: 10,
  },
});

// Settle the view Signups after u settle the stuff from the eventsPage's i'm in end.

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
  const [changedPicture, setChangedPicture] = useState(false);
  const { user } = useAuth();

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

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", props.id);

      if (error) {
        console.error("Error deleting event:", error);
      } else {
        console.log("Event deleted successfully");
        Alert.alert("Success", "Event deleted successfully");
        // You can update the local state or perform any other necessary actions after deletion
      }
    } catch (error) {
      console.error("Error deleting event:", error);
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
      <Card style={styles.cardContainer}>
        <Card.Content>
          <Text variant="titleLarge">
            {props.name} • {props.date}
          </Text>
          <Text variant="bodyMedium">
            Time: {props.time} • Venue: {props.venue}
          </Text>
        </Card.Content>

        <TouchableOpacity>
          <Card.Cover source={{ uri: props.image_url }} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Card.Actions>
            <Button onPress={handleEditPress} mode={"outlined"}>
              Edit
            </Button>
            <Button onPress={handleDelete} mode={"outlined"}>
              Delete
            </Button>
            <Button onPress={handleViewSignups} mode={"outlined"}>
              View Signups
            </Button>
          </Card.Actions>
        </TouchableOpacity>
      </Card>

      <Modal
        visible={editVisible}
        animationType="slide"
        onRequestClose={handleDonePress}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : null}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 100} // Adjust this offset as needed
        >
          <ScrollView contentContainerStyle={styles.modalContainer}>
            <SafeAreaView style={styles.modalContainer}>
              <View>
                <Text style={styles.editValuesText}>
                  {" "}
                  Edit the values accordingly{" "}
                </Text>
                {errMsg !== "" && <Text>{errMsg}</Text>}
                <Text style={styles.Text}>Name: </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  editable={editMode}
                  mode="outlined"
                />
                <Text style={styles.Text}>Venue: </Text>
                <TextInput
                  value={venue}
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
                  onPress={handleAddProfilePic}
                  style={styles.changePfpButton}
                  mode="outlined"
                >
                  {" "}
                  Change Profile Picture{" "}
                </Button>
                {image && (
                  <Image source={{ uri: image }} style={styles.Image} />
                )}

                {editMode && (
                  <Button onPress={handleDonePress} style={styles.doneButton}>
                    Done
                  </Button>
                )}
              </View>
            </SafeAreaView>
          </ScrollView>
        </KeyboardAvoidingView>
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
          <Text style={styles.signupsText}>
            Names : {props.signups.map((name) => `${name}, `)}
          </Text>
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {loading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : (
          eventsData.map((card) => (
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
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

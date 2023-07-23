import { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  View,
} from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/auth";
import * as ImagePicker from "expo-image-picker";

const styles = StyleSheet.create({
  Button: {
    marginTop: 16,
    backgroundColor: "cyan",
    alignSelf: "center",
  },
  Text: {
    fontWeight: "bold",
  },

  button: {
    marginBottom: 16,
    backgroundColor: "cyan",
    alignSelf: "center",
    width: "60%",
  },

  successText: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    marginVertical: 10,
  },
  Image: {
    width: "100%",
    height: 300,
    alignSelf: "center",
    margin: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  labelText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  inputBox: {
    fontSize: 16,
    fontWeight: "bold",
    paddingVertical: 8,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 20,
  },
});

// Form which requires inputting of key information like name, venue, date, time
// Able to insert an image as well


export function EventForm({ onEventCreate }) {
  const [eventName, setEventName] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [description, setDescription] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const { user } = useAuth();

  const resetForm = () => {
    setEventName("");
    setEventVenue("");
    setEventDate("");
    setEventTime("");
    setDescription("");
    setImage(null);
    setErrMsg("");
    setLoading(false);
    console.log("resetForm is reached");
    console.log("this is the event DAT");
  };

  const handleAddImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Error handling if there is an issue with the event form - if any keye field is missing

  const handleCreate = async () => {
    setErrMsg("");
    if (eventName === "") {
      setErrMsg("Name of event cannot be empty");
      return;
    }
    if (eventVenue === "") {
      setErrMsg("Venue of event cannot be empty");
      return;
    }
    if (eventDate === "") {
      setErrMsg("Date of event cannot be empty");
      return;
    }
    if (eventTime === "") {
      setErrMsg("Time of event cannot be empty");
      return;
    }
    setLoading(true);
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
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        setLoading(false);
        console.log(error);
        setErrMsg(error.message);
        return;
      }

      console.log(
        "THIS MY residence",
        data.residence,
        "this is my creator",
        data.name
      );

      const creatorName = data.name;
      const residenceName = data.residence;

      const { error: insertError } = await supabase
        .from("events")
        .insert({
          name: eventName,
          user_id: user.id,
          image_url: uploadedImage,
          date: eventDate,
          time: eventTime,
          venue: eventVenue,
          description: description,
          creator: creatorName,
          residence: residenceName,
        })
        .single();

      if (insertError) {
        setLoading(false);
        console.log(insertError);
        setErrMsg(insertError.message);
        return;
      }

      setLoading(false);
      onEventCreate();
      console.log(eventVenue);
      resetForm();
      console.log(eventVenue);
    } catch (error) {
      setLoading(false);
      console.log(error);
      setErrMsg("An error occurred");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 100} // Adjust this offset as needed
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 10 }}>
          <View style={styles.inputContainer}>
            <Text style={styles.labelText}>Name of Event</Text>
            <TextInput
            testID='eventNameInput'
              value={eventName}
              onChangeText={setEventName}
              mode="outlined"
              style={styles.inputBox}
            />
            <Text style={styles.labelText}>Venue</Text>
            <TextInput
              testID='eventVenueInput'
              value={eventVenue}
              onChangeText={setEventVenue}
              mode="outlined"
              style={styles.inputBox}
            />
            <Text style={styles.labelText}>Date (in YYYY-MM-DD) </Text>
            <TextInput
              testID='eventDateInput'

              value={eventDate}
              onChangeText={setEventDate}
              mode="outlined"
              placeholder="YYYY-DD-MM"
              style={styles.inputBox}
            />
            <Text style={styles.labelText}>Time</Text>
            <TextInput
              testID='eventTimeInput'
              value={eventTime}
              onChangeText={setEventTime}
              mode="outlined"
              style={styles.inputBox}
            />
            <Text style={styles.labelText}>Description</Text>
            <TextInput
              testID='eventDescriptionInput'
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              style={styles.inputBox}
              multiline
            />
          </View>
          {errMsg !== "" && <Text style={styles.error}>{errMsg}</Text>}
          {image && <Image source={{ uri: image }} style={styles.Image} />}
          <Button onPress={handleAddImage} style={styles.button}>
            Add Image
          </Button>
          <Button testID="createEventButton" onPress={handleCreate} style={styles.button}>
  Create
</Button>

          {loading && <ActivityIndicator />}
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Once form is created, "Event Created Successfully" is rendered - with a button to create another form

export default function CreateEvents() {
  const [eventCreated, setEventCreated] = useState(false);

  const handleEventCreate = () => {
    console.log('handleEventCreate is called'); 
    setEventCreated(true);
  };

  const handleCreateAnotherEvent = () => {
    setEventCreated(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {!eventCreated && (
        <EventForm
          onEventCreate={handleEventCreate}
          // onResetForm={handleCreateAnotherEvent}
        />
      )}
      {eventCreated && (
        <SafeAreaView>
          <Text testID='successMessage' style={styles.successText}>Event created successfully!</Text>

          <Button onPress={handleCreateAnotherEvent} style={styles.button}>
            Create Another Event
          </Button>
        </SafeAreaView>
      )}
    </View>
  );
}
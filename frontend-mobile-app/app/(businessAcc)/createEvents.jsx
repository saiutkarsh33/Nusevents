import { useState } from "react";
import { Image, StyleSheet } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/auth";
import { useRouter } from "expo-router";
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
});

function EventForm({ onEventCreate }) {
  const [eventName, setEventName] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [description, setDescription] = useState("");
  const [creator, setCreator] = useState("");
  const [residence, setResidence] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const { user } = useAuth();
  const router = useRouter();

  const handleAddImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleCreate = async () => {
    setErrMsg("");
    if (eventName === "") {
      setErrMsg("Event name cannot be empty");
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
  
      setCreator(data.name);
      setResidence(data.residence);
  
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
          creator: data.name,
          residence: data.residence,
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
      router.push("/");
    } catch (error) {
      setLoading(false);
      console.log(error);
      setErrMsg("An error occurred");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      <Text style={styles.Text}>Name of Event</Text>
      <TextInput value={eventName} onChangeText={setEventName} mode="outlined" />
      <Text style={styles.Text}>Venue</Text>
      <TextInput value={eventVenue} onChangeText={setEventVenue} mode="outlined" />
      <Text style={styles.Text}>Date (in YYYY-MM-DD) </Text>
      <TextInput
        value={eventDate}
        onChangeText={setEventDate}
        mode="outlined"
        placeholder="YYYY-DD-MM"
      />
      <Text style={styles.Text}>Time</Text>
      <TextInput value={eventTime} onChangeText={setEventTime} mode="outlined" />
      <Text style={styles.Text}>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        mode="outlined"
      />
      {errMsg !== "" && <Text>{errMsg}</Text>}
      <Button onPress={handleAddImage} style={styles.Button}>
        Add Image
      </Button>
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      <Button onPress={handleCreate} style={styles.Button}>
        Create
      </Button>
      {loading && <ActivityIndicator />}
    </SafeAreaView>
  );
}

export default function CreateEvents() {
  const [eventCreated, setEventCreated] = useState(false);

  const handleEventCreate = () => {
    setEventCreated(true);
  };

  const handleCreateAnotherEvent = () => {
    setEventCreated(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {!eventCreated && <EventForm onEventCreate={handleEventCreate} />}
      {eventCreated && 
      <SafeAreaView>
      <Text>Event created successfully!</Text>
      <Button onPress={handleCreateAnotherEvent}>Create Another Event</Button>
      </SafeAreaView>
      }
    </SafeAreaView>

  );
}


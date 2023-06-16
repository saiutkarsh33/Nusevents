import { useState } from "react";
import { Image } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/auth";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function CreateEvents() {
  const [eventName, setEventName] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [description, setDescription] = useState("");
  const [important, setImportant] = useState(false);
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
    const { error } = await supabase
      .from("events")
      .insert({
        name: eventName,
        user_id: user.id,
        image_url: uploadedImage,
        date: eventDate,
        time: eventTime,
        venue: eventVenue,
        desc: description,
        important: important,
      })
      .select()
      .single();

    if (error) {
      setLoading(false);
      console.log(error);
      setErrMsg(error.message);
      return;
    }
    setLoading(false);
    router.push("/"); // go back to homepage
  };

  const handleImportant = () => {
    setImportant(!important);
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      <Text>Name of Event</Text>
      <TextInput
        value={eventName}
        onChangeText={setEventName}
        mode="outlined"
      />
      <Text>Venue</Text>
      <TextInput
        value={eventVenue}
        onChangeText={setEventVenue}
        mode="outlined"
      />
      <Text>Date (in YYYY-MM-DD) </Text>
      <TextInput
        value={eventDate}
        onChangeText={setEventDate}
        mode="outlined"
        placeholder="YYYY-DD-MM"
      />
      <Text>Time</Text>
      <TextInput
        value={eventTime}
        onChangeText={setEventTime}
        mode="outlined"
      />
      <Text>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        mode="outlined"
      />
      {errMsg !== "" && <Text>{errMsg}</Text>}
      <Button onPress={handleAddImage}>Add Image</Button>
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}
      <Button onPress={handleCreate}>Create</Button>
      {loading && <ActivityIndicator />}
      <Button
        onPress={handleImportant}
        mode={important ? "contained" : "outlined"}
        style={{ backgroundColor: important ? "yellow" : "white" }}
      >
        Important
      </Button>
    </SafeAreaView>
  );
}

import { useState } from "react";
import { View, Image } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/auth";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function createEvents() {
  const [eventName, setEventName] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const { user } = useAuth();
  const router = useRouter();

  const handleCreateEvent = async () => {
    setErrMsg("");
    if (eventName === "") {
      setErrMsg("Event name cannot be empty");
      return;
    }
    setLoading(true);
    let uploadedImage = null;
    if (image != null) {
      const { data, error } = await supabase.storage
        .from("images")
        .upload(`${new Date().getTime()}`, {
          uri: image,
          type: "jpg",
          name: "name.jpg",
        });

      if (error != null) {
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
    .insert({ task: title, user_id: user.id, image_url: uploadedImage })
    .select()
    .single();

  if (error != null) {
    setLoading(false);
    console.log(error);
    setErrMsg(error.message);
    return;
  }
  setLoading(false);
  router.push("/");
};
  };
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Text>Name of Event</Text>
      <TextInput
        value={eventName}
        onChangeText={setEventName}
        mode="outlined"
      />
      <Text>Venue</Text>
      <TextInput value={venue} onChangeText={setVenue} mode="outlined" />
      <Text>Date</Text>
      <TextInput value={date} onChangeText={setDate} mode="outlined" />
      <Text>Time</Text>
      <TextInput value={time} onChangeText={setTime} mode="outlined" />
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
      <Button onPress={handleCreateEvent}>Create</Button>
      {loading && <ActivityIndicator />}
    </View>
  );
}

import { useState } from "react";
import { View, Image } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/auth";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function NewTodo() {
  const [title, setTitle] = useState("");
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

  const handleSubmit = async () => {
    setErrMsg("");
    if (title === "") {
      setErrMsg("title cannot be empty");
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
      .from("todos")
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

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Text>Title: </Text>
      <TextInput value={title} onChangeText={setTitle} />
      {errMsg !== "" && <Text>{errMsg}</Text>}
      <Button onPress={handleAddImage}>Add Image</Button>
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}
      <Button onPress={handleSubmit}>Submit</Button>
      {loading && <ActivityIndicator />}
    </View>
  );
}

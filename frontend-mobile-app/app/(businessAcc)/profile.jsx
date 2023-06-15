import { Button, Alert } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";

import { supabase } from "../../lib/supabase";
import { useState } from "react";
import { useAuth } from "../../contexts/auth";

export default function ProfileScreen() {
  const { user } = useAuth();
  const [image, setImage] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddProfilePic = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
    setLoading(true);
    let uploadedImage = null;
    if (image) {
      const { data, error } = await supabase.storage
        .from("profile_pic")
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
      } = supabase.storage.from("profile_pic").getPublicUrl(data.path);
      uploadedImage = publicUrl;
    }
    const { error } = await supabase
      .from("users")
      .update({ profile_pic_url: uploadedImage })
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      setLoading(false);
      console.log(error);
      setErrMsg(error.message);
      return;
    }
    setLoading(false);
  };

  const handleChangePassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        console.error("Error resetting password:", error);
        // Handle error
      } else {
        Alert.alert(
          "Password Reset",
          "Password reset email sent. Please check your email.",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }]
        );
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      // Handle error
    }
  };

  return (
    <SafeAreaView>
      {errMsg !== "" && <Text>{errMsg}</Text>}
      {loading && <ActivityIndicator />}
      <Button title="Add Profile Picture" onPress={handleAddProfilePic} />
      <Button
        title="Change Password"
        onPress={() => handleChangePassword(user.email)}
      />
      <Button title="Logout" onPress={() => supabase.auth.signOut()} />
    </SafeAreaView>
  );
}

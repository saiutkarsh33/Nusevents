import { View, TextInput, Button, Alert } from "react-native";
import { supabase } from "../../lib/supabase";
import { useState } from "react";

export default function ProfileScreen() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = async () => {
    try {
      const { error } = await supabase.auth.update({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      Alert.alert("Success", "Password updated successfully");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View>
      <TextInput
        secureTextEntry
        placeholder="Current Password"
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <TextInput
        secureTextEntry
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <Button title="Change Password" onPress={handleChangePassword} />
      <Button title="Logout" onPress={() => supabase.auth.signOut()} />
    </View>
  );
}

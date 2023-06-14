import { View, TextInput, Button, Alert } from "react-native";
import { supabase } from "../../lib/supabase";
import { useState } from "react";
import { useAuth } from "../../contexts/auth";

export default function ProfileScreen() {
  
  const { user } = useAuth();

  const handleChangePassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        console.error('Error resetting password:', error);
        // Handle error
      } else {
        Alert.alert(
          "Password Reset",
          "Password reset email sent. Please check your email.",
          [
            { text: "OK", onPress: () => console.log("OK Pressed") }
          ]
        );
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      // Handle error
    }
  }

  return (
    <View>
      <Button title="Change Password" onPress={() => handleChangePassword(user.email)} />
      <Button title="Logout" onPress={() => supabase.auth.signOut()} />
    </View>
  );
}

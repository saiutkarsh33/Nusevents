import {
  View,
  Alert,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  RefreshControl,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Button, Card, Text, TextInput } from "react-native-paper";

import { supabase } from "../../lib/supabase";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/auth";
import { useRouter } from "expo-router";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  scrollContent: {
    flexGrow: 1,
  },

  text: {
    fontSize: 16,
    textAlign: "center",
    paddingVertical: 25,
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    marginTop: 15,
    backgroundColor: "cyan",
    alignSelf: "center",
    width: "60%",
  },
  back: {
    marginTop: 15,
    backgroundColor: "white",
    alignSelf: "center",
    width: "60%",
  },
  buttonLabel: {
    fontSize: 15,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});

export default function ChangePassword() {
  const [currPassword, setCurrPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const { user } = useAuth();
  const router = useRouter();

  const handleSubmit = async () => {
    if (newPassword === "") {
      setErrMsg("New Password cannot be empty");
      return;
    }
    if (confirmNewPassword != newPassword) {
      setErrMsg("Password does not match");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    if (error) {
      setErrMsg(error.message);
      return;
    }
    // Sign out the user
    await supabase.auth.signOut();
    console.log("User signed out");
    router.replace("../../login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.text}>Fill in below to Change Password</Text>
        {/* <View style={styles.inputContainer}>
          <TextInput
            secureTextEntry
            autoCapitalize="none"
            textContentType="password"
            value={currPassword}
            onChangeText={setCurrPassword}
            mode="outlined"
            placeholder="Current Password"
            style={styles.input}
          />
        </View> */}
        <View style={styles.inputContainer}>
          <TextInput
            secureTextEntry
            autoCapitalize="none"
            textContentType="newPassword"
            value={newPassword}
            onChangeText={setNewPassword}
            mode="outlined"
            placeholder="New Password"
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            secureTextEntry
            autoCapitalize="none"
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
            mode="outlined"
            placeholder="Confirm New Password"
            style={styles.input}
          />
        </View>
        <Button
          onPress={handleSubmit}
          mode="contained"
          buttonColor="cyan"
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Submit
        </Button>
        <Button
          onPress={() => router.back()}
          mode="outlined"
          buttonColor="cyan"
          style={styles.back}
          labelStyle={styles.buttonLabel}
        >
          Back
        </Button>
        {errMsg !== "" && <Text style={styles.error}>{errMsg}</Text>}
        {loading && <ActivityIndicator />}
      </ScrollView>
    </SafeAreaView>
  );
}

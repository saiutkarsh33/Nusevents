import {
  Image,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { Link } from "expo-router";
import { supabase } from "../../lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

// our login page, has text inputs for email and password, shows error messages when there are issues with them
// able to redirect to sign up page when theres an issue
// logs the user into their respecive layout (business or personal)

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    if (email === "") {
      setErrMsg("Email cannot be empty");
      return;
    }
    if (password === "") {
      setErrMsg("Password cannot be empty");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setErrMsg(error.message);
      return;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 100} // Adjust this offset as needed
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Image
          source={require("frontend-mobile-app/assets/NUSevents-icon.jpg")}
          style={styles.image}
        />
        <Text style={styles.welcome}>Welcome Back!</Text>
        <Text style={[styles.details, styles.text]}>
          Please fill in your details to login
        </Text>
        <TextInput
          autoCapitalize="none"
          textContentType="emailAddress"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          placeholder="Email"
          style={styles.input}
        />
        <TextInput
          secureTextEntry
          autoCapitalize="none"
          textContentType="password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          placeholder="Password"
          style={styles.input}
        />
        <Button onPress={handleSubmit} mode="contained" style={styles.button}>
          Sign In
        </Button>
        {errMsg !== "" && <Text style={styles.error}>{errMsg}</Text>}
        {loading && <ActivityIndicator />}
        <Text style={styles.signupText}>No Account Yet?</Text>
        <Button
          mode="outlined"
          onPress={() => router.replace("/register")}
          style={styles.signup}
        >
          Sign Up
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  contentContainer: {
    flexGrow: 1,
  },
  image: {
    marginVertical: 50,
    width: "100%",
    height: "15%",
  },
  welcome: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    paddingBottom: 10,
  },
  details: {
    textAlign: "center",
    paddingBottom: 30,
    fontSize: 18,
  },
  text: {
    fontSize: 18,
  },
  input: {
    fontSize: 16,
    fontWeight: "bold",
    paddingVertical: 8,
    marginTop: 10,
  },
  button: {
    marginTop: 15,
    backgroundColor: "cyan",
    alignSelf: "center",
    width: "60%",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  signup: {
    marginTop: 5,
    alignSelf: "center",
    width: "60%",
  },
  signupText: {
    marginTop: 20,
    alignSelf: "center",
  },
});

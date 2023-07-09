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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 100} // Adjust this offset as needed
      >
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Image
            source={require("frontend-mobile-app/assets/NUSevents-icon.jpg")}
            style={styles.image}
          />
          <Text style={styles.welcome}>Welcome Back!</Text>
          <Text style={[styles.details, styles.text]}>
            Please fill in your details to access your account
          </Text>
          <Text style={styles.label}>Email</Text>
          <TextInput
            autoCapitalize="none"
            textContentType="emailAddress"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            secureTextEntry
            autoCapitalize="none"
            textContentType="password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
          />
          <Button onPress={handleSubmit} mode="contained" style={styles.button}>
            Submit
          </Button>
          {errMsg !== "" && <Text style={styles.error}>{errMsg}</Text>}
          {loading && <ActivityIndicator />}
          <Link href="/register" style={styles.signup}>
            <Button
              mode="contained"
              // onPress={() => router.replace("/register")}
            >
              Sign Up Via Email
            </Button>
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    justifyContent: "center",
  },
  image: {
    marginTop: 50,
    marginBottom: 50,
    width: "100%",
    height: 100,
  },
  welcome: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    paddingBottom: 10,
  },
  details: {
    textAlign: "center",
    paddingBottom: 60,
    fontSize: 18,
  },
  text: {
    fontSize: 18,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    paddingTop: 10,
  },
  input: {
    fontSize: 16,
    fontWeight: "bold",
    paddingVertical: 8,
  },
  button: {
    marginTop: 16,
    backgroundColor: "cyan",
    alignSelf: "center",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  signup: {
    margin: 10,
    alignSelf: "center",
  },
});

import { Image, StyleSheet } from "react-native";
import { useState } from "react";
import {
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Provider,
} from "react-native-paper";
import { Link } from "expo-router";
import { supabase } from "../../lib/supabase";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async () => {
    setErrMsg("");
    if (email == "") {
      setErrMsg("email cannot be empty");
      return;
    }
    if (password == "") {
      setErrMsg("password cannot be empty");
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Image
        source={require("frontend-mobile-app/assets/NUSevents-icon.jpg")}
        style={styles.image}
      />
      <Text style={styles.welcome}>Welcome Back!</Text>
      <Text style={styles.details}>
        Please fill your details to access your account
      </Text>
      <Text>Email</Text>
      <TextInput
        autoCapitalize="none"
        textContentType="emailAddress"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
      />
      <Text>Password</Text>
      <TextInput
        secureTextEntry
        autoCapitalize="none"
        textContentType="password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
      />
      <Button onPress={handleSubmit}>Submit</Button>
      {errMsg !== "" && <Text>{errMsg}</Text>}
      {loading && <ActivityIndicator />}
      <Link href="/register">
        <Button>Go to register</Button>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    marginTop: 50,
    marginBottom: 50,
    width: "100%",
    height: 100,
  },
  welcome: {
    paddingBottom: 10,
    fontSize: 40,
    fontWeight: "bold",
  },
  details: {
    paddingBottom: 60,
  },
});

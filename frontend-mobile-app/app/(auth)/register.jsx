import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { StyleSheet } from "react-native";
import { Text, TextInput, ActivityIndicator, Button } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async () => {
    if (email == "") {
      setErrMsg("email cannot be empty");
      return;
    }
    if (password == "") {
      setErrMsg("password cannot be empty");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setErrMsg(error.message);
      return;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <Text style={styles.welcome}>Welcome!</Text>
        <Text style={styles.details}>
          Please fill in your details to create your account
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
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  welcome: {
    paddingTop: 50,
    paddingBottom: 20,
    fontSize: 40,
    fontWeight: "bold",
  },
  details: {
    paddingBottom: 60,
  },
});

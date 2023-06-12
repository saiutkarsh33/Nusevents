import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { StyleSheet } from "react-native";
import { Text, TextInput, ActivityIndicator, Button } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/auth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userResidence, setUserResidence] = useState("");
  const [userName, setUserName] = useState("");
  const [userAccountType, setUserAccountType] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (email == "") {
      setErrMsg("email cannot be empty");
      return;
    }
    if (password == "") {
      setErrMsg("password cannot be empty");
      return;
    }
    if (userName == "") {
      setErrMsg("name cannot be empty");
      return;
    }
    if (userAccountType == "") {
      setErrMsg("account type cannot be empty");
      return;
    }
    if (userResidence == "") {
      setErrMsg("name of residence cannot be empty");
      return;
    }
    setLoading(true);

    const { detailsError } = await supabase
      .from("accounts")
      .insert({
        name: userName,
        user_id: user.id,
        residence: userResidence,
        account_type: userAccountType,
      })
      .select()
      .single();

    if (detailsError != null) {
      console.log(detailsError);
      setErrMsg(detailsError.message);
      setLoading(false);
      return;
    }
    const { authError } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (authError) {
      setErrMsg(authError.message);
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
        <Text>Name</Text>
        <TextInput
          autoCapitalize="none"
          value={userName}
          onChangeText={setUserName}
          mode="outlined"
        />
        <Text>Account Type</Text>
        <TextInput
          autoCapitalize="none"
          value={userAccountType}
          onChangeText={setUserAccountType}
          mode="outlined"
        />
        <Text>Name of Residence</Text>
        <TextInput
          autoCapitalize="none"
          value={userResidence}
          onChangeText={setUserResidence}
          mode="outlined"
        />
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

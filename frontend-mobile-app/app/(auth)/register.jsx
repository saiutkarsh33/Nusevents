import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { StyleSheet, KeyboardAvoidingView,
  ScrollView, 
  Platform, } from "react-native";
import { Text, TextInput, ActivityIndicator, Button,  } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import DropDownPicker from "react-native-dropdown-picker";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [description, setDescription] = useState("");
  const [accountTypeOpen, setAccountTypeOpen] = useState(false);
  const [accountTypeValue, setAccountTypeValue] = useState(null);
  const [accountType, setAccountType] = useState([
    {
      label: "Personal",
      value: "Personal",
    },
    {
      label: "Business",
      value: "Business",
    },
  ]);

  const [residenceOpen, setResidenceTypeOpen] = useState(false);
  const [residenceValue, setResidenceValue] = useState(null);
  const [residence, setResidence] = useState([
    {
      label: "Tembusu",
      value: "Tembusu",
    },
    {
      label: "Sheares",
      value: "Sheares",
    },
  ]);

  const handleSubmit = async () => {
    if (email === "") {
      setErrMsg("Email cannot be empty");
      return;
    }
    if (password === "") {
      setErrMsg("Password cannot be empty");
      return;
    }
    if (userName === "") {
      setErrMsg("Name cannot be empty");
      return;
    }
    if (!accountTypeValue) {
      setErrMsg("Account type cannot be empty");
      return;
    }
    if (!residenceValue) {
      setErrMsg("Name of residence cannot be empty");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userName,
          account_type: accountTypeValue,
          residence: residenceValue,
          description,
        },
      },
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
keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 100}// Adjust this offset as needed
 >
    
      <Text style={styles.welcome}>Welcome!</Text>
      <Text style={styles.details}>Please fill in your details to create your account</Text>
      <TextInput
        autoCapitalize="none"
        value={userName}
        onChangeText={setUserName}
        mode="outlined"
        placeholder="Name"
        style={styles.input}
      />
      <DropDownPicker
        open={accountTypeOpen}
        value={accountTypeValue}
        items={accountType}
        setOpen={setAccountTypeOpen}
        setValue={setAccountTypeValue}
        setItems={setAccountType}
        placeholder="Select Account Type"
        zIndex={3000}
        zIndexInverse={1000}
        style={styles.input}
        textStyle={styles.dropDownText}
      />
      <DropDownPicker
        open={residenceOpen}
        value={residenceValue}
        items={residence}
        setOpen={setResidenceTypeOpen}
        setValue={setResidenceValue}
        setItems={setResidence}
        placeholder="Select Name of Residence"
        zIndex={1000}
        zIndexInverse={3000}
        style={styles.input}
        textStyle={styles.dropDownText}
      />
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

      <TextInput
        autoCapitalize="none"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        placeholder="Description"
        style={styles.input}
      />
      <Button
        onPress={handleSubmit}
        mode="contained"
        color="cyan"
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        Submit
      </Button>
      {errMsg !== "" && <Text style={styles.error}>{errMsg}</Text>}
      {loading && <ActivityIndicator />}
    

  </KeyboardAvoidingView>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  welcome: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    paddingBottom: 20,
  },
  details: {
    fontSize: 16,
    textAlign: "center",
    paddingBottom: 20,
  },
  input: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  dropDownText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    marginTop: 16,
    backgroundColor: "cyan",
    alignSelf: "center",
  },
  buttonLabel: {
    fontWeight: "bold",
    fontSize: 15,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});


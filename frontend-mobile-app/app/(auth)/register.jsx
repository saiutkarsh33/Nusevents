import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { StyleSheet } from "react-native";
import { Text, TextInput, ActivityIndicator, Button } from "react-native-paper";
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
    if (!accountTypeValue) {
      setErrMsg("account type cannot be empty");
      return;
    }
    if (!residenceValue) {
      setErrMsg("name of residence cannot be empty");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: userName,
          account_type: accountTypeValue,
          residence: residenceValue,
          description: description,
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Text style={styles.welcome}>Welcome!</Text>
      <Text>Please fill in your details to create your account</Text>
      <TextInput
        autoCapitalize="none"
        value={userName}
        onChangeText={setUserName}
        mode="outlined"
        placeholder="Name"
        style={styles.details}
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
        style={styles.details}
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
        style={styles.details}
      />
      <TextInput
        autoCapitalize="none"
        textContentType="emailAddress"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        placeholder="Email"
        style={styles.details}
      />
      <TextInput
        secureTextEntry
        autoCapitalize="none"
        textContentType="password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        placeholder="Password"
        style={styles.details}
      />

      <TextInput
        autoCapitalize="none"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        placeholder="Description"
        style={styles.details}
      />
      <Button onPress={handleSubmit}>Submit</Button>
      {errMsg !== "" && <Text>{errMsg}</Text>}
      {loading && <ActivityIndicator />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  welcome: {
    fontSize: 40,
    fontWeight: "bold",
    paddingBottom: 20,
  },
  details: {
    marginVertical: 10,
  },
});

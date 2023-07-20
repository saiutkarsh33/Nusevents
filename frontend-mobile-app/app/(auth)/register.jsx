import { useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  View,
} from "react-native";
import { Text, TextInput, ActivityIndicator, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dropdown } from "react-native-element-dropdown";

import { useRouter } from "expo-router";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [description, setDescription] = useState("");
  const [accountTypeValue, setAccountTypeValue] = useState(null);
  const [residenceValue, setResidenceValue] = useState(null);
  const router = useRouter();

  const accountTypeOptions = [
    { label: "Personal", value: "Personal" },
    { label: "Business", value: "Business" },
  ];

  const residenceOptions = [
    { label: "Tembusu", value: "Tembusu" },
    { label: "Sheares", value: "Sheares" },
  ];

  const handleSubmit = async () => {
    if (email === "") {
      setErrMsg("Email cannot be empty");
      return;
    }
    if (password === "") {
      setErrMsg("Password cannot be empty");
      return;
    }
    if (confirmPassword != password) {
      setErrMsg("Password does not match");
      return;
    }
    if (userName === "") {
      setErrMsg("Name cannot be empty");
      return;
    }
    if (!accountTypeValue) {
      setErrMsg("Account Type cannot be empty");
      return;
    }
    if (!residenceValue) {
      setErrMsg("Residence cannot be empty");
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
    router.replace("/login");
  };



  const content = (
    <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.welcome}>Welcome!</Text>
        <Text style={styles.details}>
          Please fill in your details to create your account
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            autoCapitalize="none"
            value={userName}
            onChangeText={setUserName}
            mode="outlined"
            placeholder="Name"
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.dropdownLabel}>Account Type</Text>
          <Dropdown
            style={styles.dropdown}
            placeholder="Select Account Type"
            value={accountTypeValue}
            onChange={(item) => setAccountTypeValue(item.value)}
            data={accountTypeOptions}
            labelField="label"
            valueField="value"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.dropdownLabel}>Residence </Text>
          <Dropdown
            style={styles.dropdown}
            placeholder="Select Residence "
            value={residenceValue}
            onChange={(item) => setResidenceValue(item.value)}
            data={residenceOptions}
            labelField="label"
            valueField="value"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            autoCapitalize="none"
            textContentType="emailAddress"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            placeholder="Email"
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
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
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            secureTextEntry
            autoCapitalize="none"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            mode="outlined"
            placeholder="Confirm Password"
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            autoCapitalize="none"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            placeholder="Description"
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
        {errMsg !== "" && <Text style={styles.error}>{errMsg}</Text>}
        {loading && <ActivityIndicator />}
      </ScrollView>
  );

  return Platform.OS === 'ios' ? (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 100}
    >
      {content}
    </KeyboardAvoidingView>
  ) : (
    <SafeAreaView style={styles.container}>
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  scrollContent: {
    flexGrow: 1,
  },

  welcome: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 30,
  },
  details: {
    fontSize: 16,
    textAlign: "center",
    paddingBottom: 20,
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    fontSize: 16,
    fontWeight: "bold",
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  button: {
    marginTop: 15,
    backgroundColor: "cyan",
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
  back: {
    margin: 10,
    alignSelf: "left",
  },
  dropdown: {
    margin: 16,
    height: 50,
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
  },
});
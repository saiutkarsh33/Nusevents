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
import RNPickerSelect from "react-native-picker-select";

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
    if (accountTypeValue === "") {
      setErrMsg("Account Type cannot be empty");
      return;
    }
    if (residenceValue === "") {
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
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "padding" : "padding"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 100}
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
            <RNPickerSelect
              value={accountTypeValue}
              onValueChange={(value) => setAccountTypeValue(value)}
              items={accountTypeOptions}
              placeholder={{ label: "Select Account Type", value: null }}
              style={pickerSelectStyles}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.dropdownLabel}>Residence</Text>
            <RNPickerSelect
              value={residenceValue}
              onValueChange={(value) => setResidenceValue(value)}
              items={residenceOptions}
              placeholder={{ label: "Select Name of Residence", value: null }}
              style={pickerSelectStyles}
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
        </KeyboardAvoidingView>
      </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: "bold",
  },
  inputAndroid: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
});

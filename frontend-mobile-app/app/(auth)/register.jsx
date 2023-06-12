import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { StyleSheet, View } from "react-native";
import {
  Text,
  TextInput,
  ActivityIndicator,
  Button,
  Provider,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import DropDown from "react-native-paper-dropdown";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userResidence, setUserResidence] = useState("");
  const [userName, setUserName] = useState("");
  const [userAccountType, setUserAccountType] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [showDropDown, setShowDropDown] = useState(false);
  const [showResidenceDropDown, setShowResidenceDropDown] = useState(false);

  const accountTypeList = [
    {
      label: "Personal",
      value: "Personal",
    },
    {
      label: "Business",
      value: "Business",
    },
  ];

  const residenceList = [
    {
      label: "Tembusu",
      value: "Tembusu",
    },
    {
      label: "Sheares",
      value: "Sheares",
    },
  ];

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
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: userName,
          account_type: userAccountType,
          residence: userResidence,
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
    <Provider>
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
        <DropDown
          label={"Account Type"}
          mode={"outlined"}
          visible={showDropDown}
          showDropDown={() => setShowDropDown(true)}
          onDismiss={() => setShowDropDown(false)}
          value={userAccountType}
          setValue={setUserAccountType}
          list={accountTypeList}
        />
        <View style={styles.spacerStyle} />
        <DropDown
          label={"Name of Residence"}
          mode={"outlined"}
          visible={showResidenceDropDown}
          showDropDown={() => setShowResidenceDropDown(true)}
          onDismiss={() => setShowResidenceDropDown(false)}
          value={userResidence}
          setValue={setUserResidence}
          list={residenceList}
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
          style={styles.passwordTextInput}
        />
        <Button onPress={handleSubmit}>Submit</Button>
        {errMsg !== "" && <Text>{errMsg}</Text>}
        {loading && <ActivityIndicator />}
      </SafeAreaView>
    </Provider>
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
    marginVertical: 20,
  },
  spacerStyle: {
    marginVertical: 10,
  },
  passwordTextInput: {
    marginBottom: 20,
  },
});

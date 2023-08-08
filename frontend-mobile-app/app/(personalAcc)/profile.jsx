import {
  View,
  Alert,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  RefreshControl,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Button, Card, Text, TextInput } from "react-native-paper";

import { supabase } from "../../lib/supabase";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/auth";
import { Link } from "expo-router";
import { useRouter } from "expo-router";

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "white", // Add this line to set the background color
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
  },
  cardContainer: {
    // borderRadius: 0,
    margin: 10,
  },

  deleteButton: {
    marginTop: 16,
    backgroundColor: "red",
    alignSelf: "center",
    width: "50%",
  },

  cardTitle: {
    fontWeight: "bold",
    fontSize: 22,
    marginVertical: 10,
  },
  Button: {
    marginTop: 16,
    backgroundColor: "cyan",
    alignSelf: "center",
    width: "50%",
  },

  changePfpButton: {
    margin: 16,
    backgroundColor: "white",
    alignSelf: "center",
  },

  editValuesText: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    marginVertical: 10,
  },

  Text: {
    fontWeight: "bold",
    marginVertical: 10,
  },

  Image: {
    alignSelf: "center",
    width: 200,
    height: 200,
    margin: 10,
  },
  container8: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 50,   // Add padding top here
},
  scrollContent8: {
    flexGrow: 1,
  },

  text8: {
    fontSize: 16,
    textAlign: "center",
    paddingVertical: 25,
  },
  inputContainer8: {
    marginBottom: 10,
  },
  input8: {
    fontSize: 16,
    fontWeight: "bold",
  },
  button8: {
    marginTop: 15,
    backgroundColor: "cyan",
    alignSelf: "center",
    width: "60%",
  },
  back8: {
    marginTop: 15,
    backgroundColor: "white",
    alignSelf: "center",
    width: "60%",
  },
  buttonLabel8: {
    fontSize: 15,
  },
  error8: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  smallGreyText: {
    fontSize: 16,
    color: 'grey'
},
});


export default function ProfileScreen() {
  const { user } = useAuth();
  

  const [myData, setMyData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [currPassword, setCurrPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  
  // Handling some edge cases in creating new password

  const handleSubmit = async () => {

    if (newPassword.length < 6) {
      setErrMsg("Password must be at least 6 characters long");
      return;
  }


    if (newPassword === "") {
      setErrMsg("New Password cannot be empty");
      return;
    }
    if (confirmNewPassword != newPassword) {
      setErrMsg("Password does not match");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    if (error) {
      setErrMsg(error.message);
      return;
    }
    // Sign out the user
    setPasswordVisible(false)
    await supabase.auth.signOut();
    console.log("User signed out");
    
  };

  const fetchData = async () => {
    setRefreshing(true);
    setLoading(true);
    if (user) {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id);

        if (error) {
          console.error("Error fetching account:", error);
        } else {
          console.log(data);
          setMyData(data);
        }
      } catch (error) {
        console.error("Error fetching account:", error);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  useEffect(() => {
    if (refreshing) {
      fetchData();
      setRefreshing(false);
    }
  }, [refreshing]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  };

  // Handling the deletion of account

  const handleDeleteAccount = async () => {
    Alert.alert("Are you sure?", "This action cannot be undone.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Ok",
        onPress: async () => {
          // Delete the user
          await supabase.rpc("delete_user");
          console.log("User deleted");

          // Sign out the user
          await supabase.auth.signOut();
          console.log("User signed out");
        },
      },
    ]);
  };

  return (
    <>
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, backgroundColor: "white", justifyContent: 'center', alignItems: 'center' }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      
      
      <Button style={styles.Button} onPress={() => setPasswordVisible(true)}>
        Change Password
      </Button>
      <Button onPress={() => supabase.auth.signOut()} style={styles.Button}>
        Logout
      </Button>
      <Button
        onPress={() => {
          handleDeleteAccount();
        }}
        style={styles.deleteButton}
      >
        Delete Account
      </Button>
    </ScrollView>


    <Modal
        visible={passwordVisible}
        animationType="slide"
        
      >
          
      <ScrollView
        contentContainerStyle={styles.scrollContent8}
        keyboardShouldPersistTaps="handled"
      >
        <SafeAreaView style={styles.container8}>
        <Text style={styles.text8}>Fill in below to Change Password</Text>
      
        <View style={styles.inputContainer8}>
          <TextInput
            secureTextEntry
            autoCapitalize="none"
            textContentType="newPassword"
            value={newPassword}
            onChangeText={setNewPassword}
            mode="outlined"
            placeholder="New Password"
            placeholderTextColor="#888888"
            style={styles.input8}
          />
        </View>
        <View style={styles.inputContainer8}>
          <TextInput
            secureTextEntry
            autoCapitalize="none"
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
            mode="outlined"
            placeholder="Confirm New Password"
            placeholderTextColor="#888888"
            style={styles.input8}
          />
        </View>
        < Text style={styles.smallGreyText}>
          Please ensure password is of at least 6 characters and is not the same as the previous password. 
        </Text>
        <Button
          onPress={handleSubmit}
          mode="contained"
          buttonColor="cyan"
          style={styles.button8}
          labelStyle={styles.buttonLabel8}
        >
          Submit
        </Button>
        <Button
          onPress={() => setPasswordVisible(false)}
          mode="outlined"
          buttonColor="cyan"
          style={styles.back8}
          labelStyle={styles.buttonLabel8}
        >
          Back
        </Button>
        {errMsg !== "" && <Text style={styles.error8}>{errMsg}</Text>}
        {loading && <ActivityIndicator />}
        </SafeAreaView>
      </ScrollView>
    
      </Modal>
    



    </>
  );
}

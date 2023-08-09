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

  Button: {
    marginTop: 16,
    backgroundColor: "cyan",
    alignSelf: "center",
    width: "50%",
  },

  deleteButton: {
    marginTop: 16,
    backgroundColor: "red",
    alignSelf: "center",
    width: "50%",
  },

  cardContainer: {
    // borderRadius: 0,
    margin: 10,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 22,
    marginVertical: 10,
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
    fontSize: 14,
    color: 'grey',
    paddingLeft: 18,
    paddingRight: 12,

},
});

// This is the profile card.

function ProfileCard(props) {
  const [editVisible, setEditVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(props.name);
  const [description, setDescription] = useState(props.description);
  const [image, setImage] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [changedImage, setChangedImage] = useState(false);
  const { user } = useAuth();

  const handleEditPress = () => {
    setEditMode(true);
    setEditVisible(true);
  };

  const handleDonePress = async () => {
    if (user) {
      if (changedImage) {
        setLoading(true);
        let uploadedImage = null;
        if (image) {
          const { data, error } = await supabase.storage
            .from("profile_pic")
            .upload(`${new Date().getTime()}`, {
              uri: image,
              type: "jpg",
              name: "name.jpg",
            });

          if (error) {
            console.log(error);
            setErrMsg(error.message);
            setLoading(false);
            return;
          }
          const {
            data: { publicUrl },
          } = supabase.storage.from("profile_pic").getPublicUrl(data.path);
          uploadedImage = publicUrl;
        }
        // Perform the update in the Supabase table
        const { error } = await supabase
          .from("users")
          .update({
            name: name,
            description: description,
            profile_pic_url: uploadedImage,
          })
          .eq("id", user.id);

        if (error) {
          console.error("Error updating account:", error);
        } else {
          console.log("Account updated successfully");
          setEditMode(false);
          setEditVisible(false);
          const { error2 } = await supabase
            .from("events")
            .update({
              creator: name,
            })
            .eq("user_id", user.id);
        }

        setLoading(false);
      } else {
        const { error } = await supabase
          .from("users")
          .update({
            name: name,
            description: description,
          })
          .eq("id", user.id);

        if (error) {
          console.error("Error updating account:", error);
        } else {
          console.log("Account updated successfully");
          setEditMode(false);
          setEditVisible(false);
          const { error2 } = await supabase
            .from("events")
            .update({
              creator: name,
            })
            .eq("user_id", user.id);
        }
      }
    }
  };
  const handleAddProfilePic = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!result.canceled && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        setImage(selectedAsset.uri);
        console.log("Image URI:", selectedAsset.uri);
        setChangedImage(true);
      }
    } catch (error) {
      console.error("Error selecting image:", error);
      // Handle the error
    }
  };

  return (
    <>
      <Card style={styles.cardContainer} mode="outlined">
        <Card.Title title={props.name} titleStyle={styles.cardTitle} />
        {props.profile_pic_url ? (
          <Card.Cover
            style={styles.cardCover}
            source={{ uri: props.profile_pic_url }}
            theme={{
              roundness: 4,
              isV3: false,
            }}
          />
        ) : (
          <View style={{ backgroundColor: "#F0F0F0", paddingVertical: 35 }}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 18,
                textAlign: "center",
              }}
            >
              No Profile Picture
            </Text>
          </View>
        )}

        <TouchableOpacity>
          <Card.Actions>
            <Button onPress={handleEditPress} mode={"outlined"}>
              Edit
            </Button>
          </Card.Actions>
        </TouchableOpacity>
      </Card>

      <Modal
        visible={editVisible}
        animationType="slide"
        onRequestClose={handleDonePress}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : null}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 100} // Adjust this offset as needed
        >
          <ScrollView contentContainerStyle={styles.modalContainer}>
            <SafeAreaView style={styles.modalContainer}>
              <View>
                {loading && <ActivityIndicator />}
                <Text style={styles.editValuesText}>
                  {" "}
                  Edit the values accordingly{" "}
                </Text>
                {errMsg !== "" && <Text>{errMsg}</Text>}
                <Button
                  onPress={handleAddProfilePic}
                  style={styles.changePfpButton}
                  mode="outlined"
                >
                  {" "}
                  Change Profile Picture{" "}
                </Button>
                {image && (
                  <Image source={{ uri: image }} style={styles.Image} />
                )}
                <Text style={styles.Text}>Description: </Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  editable={editMode}
                  multiline
                  mode="outlined"
                />
                < Text style={styles.smallGreyText}>
           Please include point(s) of contact and a short paragraph about the types of events you organise.
        </Text>
                {editMode && (
                  <Button onPress={handleDonePress} style={styles.Button}>
                    Done
                  </Button>
                )}
              </View>
            </SafeAreaView>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

export default function ProfileScreen() {
  const { user } = useAuth();

  const [name, setName] = useState(null);
  const [myData, setMyData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [currPassword, setCurrPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

// this handles the submission of the new password

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
          console.log(data[0].name);
          setName(data[0].name);
          console.log("MY NAME IS ", name);
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
    fetchData(); // Call my fetchData function to fetch the latest data
    setRefreshing(false);
  };

  const handleChangePassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        console.error("Error resetting password:", error);
        
      } else {
        Alert.alert(
          "Password Reset",
          "Password reset email sent. Please check your email.",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }]
        );
      }
    } catch (error) {
      console.error("Error resetting password:", error);
     
    }
  };

  // this handles the deletion of account, removed from database and signs user out

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

  /// below is the layout of the code

  return (

    <>
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, backgroundColor: "white" }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <>
          {myData.map((card) => (
            <ProfileCard
              key={card.id}
              id={card.id}
              name={card.name}
              profile_pic_url={card.profile_pic_url}
              description={card.description}
            />
          ))}
        </>
      )}
      <Text style={styles.smallGreyText}>Please regularly update your profile card as Personal accounts will be able to view them in their "All CCAs" page. </Text>
      <Button style={styles.Button}onPress={() => setPasswordVisible(true)}>
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

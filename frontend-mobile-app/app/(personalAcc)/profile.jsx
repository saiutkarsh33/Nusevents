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
  cardTitle: {
    fontWeight: "bold",
    fontSize: 22,
    marginVertical: 10,
  },
  Button: {
    marginTop: 16,
    backgroundColor: "cyan",
    alignSelf: "center",
    width: "60%",
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
});

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
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      setImage(selectedAsset.uri);
      console.log("result successful", selectedAsset.uri);
      setChangedImage(true);
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

                <Text style={styles.Text}> Name: </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  editable={editMode}
                  mode="outlined"
                />
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
                <Text style={styles.Text}>Name: </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  editable={editMode}
                  mode="outlined"
                />
                <Text style={styles.Text}> Bio: </Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  editable={editMode}
                  mode="outlined"
                />
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

  const [myData, setMyData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleChangePassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        console.error("Error resetting password:", error);
        // Handle error
      } else {
        Alert.alert(
          "Password Reset",
          "Password reset email sent. Please check your email.",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }]
        );
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      // Handle error
    }
  };
  
  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        const newPassword = prompt("What would you like your new password to be?");
        const { data, error } = await supabase.auth.updateUser({ password: newPassword });
        
        if (data) {
          alert("Password updated successfully!");
        }
        if (error) {
          alert("There was an error updating your password.");
        }
      }
    });
  }, []);

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
      <Button
        onPress={() => handleChangePassword(user.email)}
        style={styles.Button}
      >
        Change Password
      </Button>
      <Button onPress={() => supabase.auth.signOut()} style={styles.Button}>
        Logout
      </Button>
      <Button
        onPress={() => {
          handleDeleteAccount();
        }}
        style={styles.Button}
      >
        Delete Account
      </Button>
    </ScrollView>
  );
}

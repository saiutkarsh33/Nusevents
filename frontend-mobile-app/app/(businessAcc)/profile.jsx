import { View, Alert, TouchableOpacity, Modal, StyleSheet, TextInput, } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import {  Button, Card, Text } from "react-native-paper";

import { supabase } from "../../lib/supabase";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/auth";

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "white", // Add this line to set the background color
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
  },

  Button: {
    marginTop: 16,
    backgroundColor: 'cyan',
    alignSelf: 'center',
  },

  editValuesText: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
  },
   
  Text: {
    fontWeight: 'bold'
  },

});

function ProfileCard(props) {
  const [editVisible, setEditVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(props.name);
  const [description, setDescription] = useState(props.description);
  const { user } = useAuth();


  const handleEditPress = () => {
    setEditMode(true);
    setEditVisible(true);
  };

  const handleDonePress = async () => {

   if (user) { 
    try {
      // Perform the update in the Supabase table
      const { error } = await supabase
        .from('users')
        .update({
          name: name,
          description: description,
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating account:', error);
      } else {
        console.log('Account updated successfully');
        setEditMode(false);
        setEditVisible(false);
        const { error2 } = await supabase
         .from('events')
         .update({
          creator: name
         })
         .eq("user_id", user.id)
      } 

    } catch (error) {
      console.error('Error updating event:', error);
    }
  }

    
  };


  return (
    <>
      <Card style={styles.cardContainer} >
        <Card.Content>
          <Text variant="titleLarge">
            {props.name} 
          </Text>
        </Card.Content>
        <TouchableOpacity>
          <Card.Cover source={{ uri: props.profile_pic_url }} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Card.Actions>
            <Button onPress={handleEditPress} mode = { "outlined"} >Edit</Button>
        
          </Card.Actions>
        </TouchableOpacity>
      </Card>

      <Modal visible={editVisible} animationType="slide" onRequestClose={handleDonePress}>
        <SafeAreaView style={styles.modalContainer} >
          <View>
          <Text style={styles.editValuesText} > Edit the values accordingly </Text>
            <Text style={styles.Text} >Name: </Text>
            <TextInput value={name} onChangeText={setName} editable={editMode} />
            <Text style={styles.Text} >Description: </Text>
            <TextInput value={description} onChangeText={setDescription} editable={editMode} />
            {editMode && (
              <Button onPress={handleDonePress} style={styles.Button}  >Done</Button>
            )}
          </View>
        </SafeAreaView>
      </Modal>

    </>
  );
}






export default function ProfileScreen() {
  const { user } = useAuth();
  const [image, setImage] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [myData, setMyData] = useState([]);

  useEffect(() => {

    if (user) { 
      
      const fetchData = async () => {
          try {
               const { data, error } = await supabase
               .from('users')
               .select("*")
               .eq('id', user.id)
              
  
            if (error) {
              console.error('Error fetching account:', error);
            } else {
              console.log(data)
              setMyData(data);
            }
          } catch (error) {
            console.error('Error fetching account:', error);
          }
        };

        fetchData(); 
      }
    }, [user]);

  const handleAddProfilePic = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
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
    const { error } = await supabase
      .from("users")
      .update({ profile_pic_url: uploadedImage })
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      setLoading(false);
      console.log(error);
      setErrMsg(error.message);
      return;
    }
    setLoading(false);
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

  // <Button onPress={handleDonePress}>Done</Button>

  return (
    <SafeAreaView>
      {errMsg !== "" && <Text>{errMsg}</Text>}
      {loading && <ActivityIndicator />}
      <Button onPress={handleAddProfilePic} style={styles.Button} > Change Profile Picture </Button>
      <Button
        onPress={() => handleChangePassword(user.email)} style={styles.Button}
      >
        Change Password
      </Button>
      <Button onPress={() => supabase.auth.signOut()} style={styles.Button} > Logout</Button>
 
      <Button title = "Delete Account" />

      {myData.map((card) => (
            <ProfileCard
              key={card.id}
              id={card.id}
              name={card.name}
              profile_pic_url={card.profile_pic_url}
              description={card.description}
            />
          ))}

    </SafeAreaView>
  );
}

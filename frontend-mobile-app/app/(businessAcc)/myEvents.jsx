import { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Modal, StyleSheet, TextInput } from "react-native";
import { supabase } from "../../lib/supabase";
import {  Button, Card, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/auth";


const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      padding: 16,
    },


    cardContainer: {
      backgroundColor: "white", // Add this line to set the background color
    },

  });

  // Settle the view Signups after u settle the stuff from the eventsPage's i'm in end.

function MyCard(props) {
    const [signupVisible, setSignupVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [venue, setVenue] = useState(props.venue);
    const [date, setDate] = useState(props.date);
    const [time, setTime] = useState(props.time);
    const [desc, setDesc] = useState(props.desc);
    const [image_url, setImage_url] = useState(props.image_url);
    const { user } = useAuth();
  
    const handleViewSignups = () => {
      setSignupVisible(true);
    };
  
    const handleCloseSignups = () => {
        setSignupVisible(false);
    };
  
    const handleEditPress = () => {
      setEditMode(true);
      setEditVisible(true);
    };
  
    const handleDonePress = async () => {

     if (user) { 
      try {
        // Perform the update in the Supabase table
        const { error } = await supabase
          .from('events')
          .update({
            venue: venue,
            date: date,
            time: time,
            desc: desc,
            image_url: image_url,
          })
          .eq('user_id', user.id);
  
        if (error) {
          console.error('Error updating event:', error);
        } else {
          console.log('Event updated successfully');
          setEditMode(false);
          setEditVisible(false);
        }
      } catch (error) {
        console.error('Error updating event:', error);
      }
    }
    };

    const handleDelete = async () => {
        try {
          const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', props.id);
    
          if (error) {
            console.error('Error deleting event:', error);
          } else {
            console.log('Event deleted successfully');
            // You can update the local state or perform any other necessary actions after deletion
          }
        } catch (error) {
          console.error('Error deleting event:', error);
        }
      };
  
    return (
      <>
        <Card style={styles.cardContainer} >
          <Card.Content>
            <Text variant="titleLarge">
              {props.name} • {props.date}
            </Text>
            <Text variant="bodyMedium">
              Time: {props.time} • Venue: {props.venue}
            </Text>
          </Card.Content>
  
          <TouchableOpacity>
            <Card.Cover source={{ uri: props.image_url }} />
          </TouchableOpacity>
  
          <TouchableOpacity>
            <Card.Actions>
              <Button onPress={handleEditPress} mode = { "outlined"} >Edit</Button>
              <Button onPress={handleDelete} mode = { "outlined"} >Delete</Button>
              <Button onPress={handleViewSignups} mode = { "outlined"} >View Signups</Button>
            </Card.Actions>
          </TouchableOpacity>
        </Card>
  
        <Modal visible={editVisible} animationType="slide" onRequestClose={handleDonePress}>
          <SafeAreaView style={styles.modalContainer} >
            <View>
              <TextInput value={venue} onChangeText={setVenue} editable={editMode} />
              <TextInput value={date} onChangeText={setDate} editable={editMode} />
              <TextInput value={time} onChangeText={setTime} editable={editMode} />
              <TextInput value={desc} onChangeText={setDesc} editable={editMode} />
              <TextInput value={image_url} onChangeText={setImage_url} editable={editMode} />
  
              {editMode && (
                <Button onPress={handleDonePress}>Done</Button>
              )}
            </View>
          </SafeAreaView>
        </Modal>


        <Modal visible={signupVisible} animationType="slide" onRequestClose={handleCloseSignups}>
          <SafeAreaView style={styles.modalContainer}>
              <Text>
                {props.signups}
              </Text>
              <Button onPress={handleCloseSignups}> Close </Button>
          </SafeAreaView>
        </Modal>

      </>
    );
  }

  export default function MyEvents() {
    const [eventsData, setEventsData] = useState([]);
    
    const { user } = useAuth();

    useEffect(() => {

      if (user) { 
        
        const fetchData = async () => {
            try {
                 const { data, error } = await supabase
                 .from('events')
                 .select("*")
                 .eq('user_id', user.id)
                
    
              if (error) {
                console.error('Error fetching events:', error);
              } else {
                console.log(data)
                setEventsData(data);
              }
            } catch (error) {
              console.error('Error fetching events:', error);
            }
          };

          fetchData(); 
        }
      }, [user]);
  
  
    return (
      <SafeAreaView>
        <ScrollView>
          {eventsData.map((card) => (
            <MyCard
              key={card.id}
              id={card.id}
              name={card.name}
              date={card.date}
              time={card.time}
              venue={card.venue}
              selected={card.selected}
              important={card.important}
              image_url={card.image_url}
              desc={card.desc}
              signups={card.signups}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }
  

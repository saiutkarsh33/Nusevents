import { View, ScrollView, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { supabase } from "../../lib/supabase";
import { Avatar, Button, Card, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";


// MyCard function, using React Native Paper library, produces cards of our event. For each event,
// a card is produced.

// Also take note that "I'm im" causes the props.selected to be true. In future, can make it such that its removed.

const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      padding: 16,
    },
  });
  
  function MyCard(props) {
    const [modalVisible, setModalVisible] = useState(false);
  
    const handleViewMorePress = () => {  
      setModalVisible(true);
    };
  
    const handleCloseModal = () => {
      setModalVisible(false);
    };
  
    return (
      <>
        <Card>
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
              <Button onPress={props.onImInPress}>I&apos;m in</Button>
              <Button onPress={handleViewMorePress}>View More</Button>
            </Card.Actions>
          </TouchableOpacity>
        </Card>
  
        <Modal visible={modalVisible} animationType="slide" onRequestClose={handleCloseModal}>
          <SafeAreaView style={styles.modalContainer}>
            <View>
              <Text>{props.desc}</Text>
              <Button onPress={handleCloseModal}>Close</Button>
            </View>
          </SafeAreaView>
        </Modal>
      </>
    );
  }
  
    
// <Card.Cover source={{ uri: "file:///Users/saiutkarsh33/Desktop/Nusevents/frontend-mobile-app/assets/tfamily.jpg" }} />


// useEventsData is a custom hook that fetches and gets the data from supabase, and returns the eventsData.




// EventsPage, which is exported, shows the actual events page. If it does not show up, might need to export the custom
// hook from somewhere else because I didnt use export default here, need to check why and when we can simply use export
// instead iof export default.

export default function EventsPage() {

  const [eventsData, setEventsData] = useState([]);

  useEffect(() => {
    // Fetch data from Supabase. Do edit this according to the actual database in supabase. *******
    async function fetchData() {
      const { data,  error } = await supabase.from('events').select('*');
      console.log('Data:', data)
      if (error) {
        console.error('Error fetching events:', error);
      } else {
        setEventsData(data);
      }
    }
    fetchData();
  }, []); 

  console.log('eventsData:', eventsData);
  

  const handleImInPress = async (eventId) => {
    try {
      // Update the event with the new value of selected in the Supabase table
      const { error } = await supabase
        .from('events')
        .update({ selected: true })
        .eq('id', eventId);
    
      if (error) {
        console.error('Error updating event:', error);
      } else {
        // Update the selected value in the local state
        setEventsData((prevEventsData) => {
          return prevEventsData.map((event) => {
            if (event.id === eventId) {
              return {
                ...event,
                selected: true,
              };
            }
            return event;
          });
        });
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };
  
  
  
  
  
  
  console.log(eventsData.map((card) => card.image_url ))

 return (
  <SafeAreaView>
    <ScrollView>
      {eventsData.map((card) => (
        <MyCard
          key={card.id}
          name={card.name}
          date={card.date}
          time={card.time}
          venue={card.venue}
          selected = {card.selected}
          important = {card.important}
          image_url = {card.image_url}
          desc = {card.desc}
          //image={require("frontend-mobile-app/assets/tfamily.jpg")} // Replace with the actual image URL 
          // itself, from supabase.
          onImInPress={() => handleImInPress(card.id)}
        />
      ))}
      </ScrollView>
  </SafeAreaView>

 )

 } 
    

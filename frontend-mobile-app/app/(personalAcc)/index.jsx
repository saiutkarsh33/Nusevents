import { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Modal, StyleSheet, RefreshControl, Image } from "react-native";
import { supabase } from "../../lib/supabase";
import { Button, Card, Text, ActivityIndicator } from "react-native-paper";
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
      backgroundColor: "#F5F3FF", // Set the background color to a very light lilac
      borderRadius: 0,
      marginVertical: 10,  // Set the border radius of the card to 0
    },
   
    fullImage: {
      width: "100%",
      height: "100%",
    },

    closeButtonImage: {
      marginTop: -25,
      backgroundColor: 'cyan',
    },


  middleText: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
  },
  
  closeButton: {
    marginTop: 16,
    backgroundColor: 'cyan',
    alignSelf: 'center',
  }, 
  noEventsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  noEventsText: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
  },

});

export function TheirCard(props) {

  const [picVisible, setPicVisible] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedButton, setSelectedButton] = useState(() => props.selected)
  
  const { user } = useAuth();

  const handleOpenPic = () => {
    setPicVisible(true);
  };
  
  const handleClosePic = () => {
    setPicVisible(false);
  };
  



  const handleViewMorePress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };
  
  

  // For this, there are 3 issues.
  // it doesent work
  // when u press im in when its yellow it shld remove it from the props.signups as well
  // the selected prop shldnt be in events but on thr personal accounts' end, where they
  // should have a eventsSelected array or sth and the I'm in button shld be affecting that.


  const handleImInPress = async () => {

    console.log("pressed")
    console.log(props.id)
    
    try {

      const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('signups')
      .eq('id', props.id)
      .single();

      if (eventError) {
        console.error('Error fetching event:', eventError);
        return;
      } else {
        console.log("event fetched")
        console.log("this is eventdata before the change :" , eventData )
      }

      const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
  
        
      if (userError) {
        console.error('Error fetching Account:', userError);
        return; 
      } else {
        console.log("user fetched")
        console.log("this is user data before the change: " , userData)
      }
      

      const signups = eventData.signups 


      const selected = userData.selected_events 


      let updatedSignups;
      let updatedSelected;

       
      if (selected.includes(props.name)) {

        // Remove event from user's selected events
        updatedSelected = selected.filter((eventName) => eventName !== props.name);
        

        // Remove user from event signups
        updatedSignups = signups.filter((signup) => signup !== userData.name);
      } else {
        // Add event to user's selected events
        updatedSelected = [...selected, props.name];

        // Add user to event signups
        updatedSignups = [...signups, userData.name];
      }
      
       

       console.log("this is updated signup", props.name , updatedSignups)




      // const updatedSignups = [...signups, accountData.name];


      // const updatedSelected = [...selected, eventData.name];


      const { data: updatedEventData, error: updateEventError } = await supabase
      .from('events')
      .update({
        signups: updatedSignups,
      })
      .eq('id', props.id)
      .select();

      console.log("this is updated data", props.name, updatedEventData)



      if (updateEventError) {
        console.error('Error updating event:', updateEventError);
      } else {
        console.log("this is signups after change" , props.name, updatedEventData[0].signups)
      }
      
      

      const { data: updatedUserData, error: updateUserError } = await supabase
      .from('users')
      .update({
        selected_events: updatedSelected,
      })
      .eq("id" , user.id)
      .select();

      if (updateUserError) {
        console.error('Error updating users:', updateUserError);
      } else {
        setSelectedButton(!selectedButton)
        props.selected = selectedButton
      }

      console.log("this is final selected", selectedButton);

    } catch (error) {
      console.error('Error updating event:', error);
    }
  };


  return (
    <>
      <Card style={styles.cardContainer} mode = 'outlined'>
        <Card.Content>
          <Text variant="titleLarge">
            {props.name} • {props.date}
          </Text>
          <Text variant="bodyMedium">
            Time: {props.time} • Venue: {props.venue}
          </Text>
        </Card.Content>

        <TouchableOpacity onPress={handleOpenPic}>
          <Card.Cover source={{ uri: props.image_url }} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Card.Actions>
            <Button
              onPress={handleImInPress}
              mode={"outlined"}
              style={{ backgroundColor: selectedButton ? "yellow" : "white" }}
            >
              I&apos;m in
            </Button>
            <Button onPress={handleViewMorePress} mode="outlined" style={{ backgroundColor: "cyan" }}>
  View Moree
</Button>

          </Card.Actions>
        </TouchableOpacity>
      </Card>

      <Modal visible={modalVisible} animationType="slide" onRequestClose={handleCloseModal}>
        <SafeAreaView style={styles.modalContainer}>
          <View>
            <Text style = {styles.middleText}>{props.desc}</Text>
            <Button onPress={handleCloseModal} style = {styles.closeButton}>Close</Button>
          </View>
        </SafeAreaView>
      </Modal>

      <Modal visible={picVisible} animationType="slide" onRequestClose={handleClosePic}>
  <View style={styles.modalContainer}>
    <Image source={{ uri: props.image_url }}  style={styles.fullImage} resizeMode="contain" />
    <Button onPress={handleClosePic} style = {styles.closeButtonImage}>Close</Button>
  </View>
 </Modal>


    </>
  );
}

// ...import statements and styles

// ...import statements and styles

export default function EventsPage() {
  const [eventsData, setEventsData] = useState([]);
  const [residence, setResidence] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const [userData, setUserData] = useState(null);
  const [followed, setFollowed] = useState([]);

  async function fetchData() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('residence', residence)
        .in('creator', followed);

      if (error) {
        console.error('Error fetching events:', error);
      } else {
        setEventsData(data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function fetchUserData() {
    if (user) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) {
        console.error('Error fetching user data:', error);
      } else {
        setResidence(data.residence);
        setFollowed(data.following);
        setUserData(data);
      }
    }
  }

  useEffect(() => {
    if (user && userData === null) {
      fetchUserData();
    }
    fetchData();
  }, [user, residence, followed]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUserData()
    await fetchData(); // Wait for fetchData to complete
    setRefreshing(false);
  };

  if (!userData) {
    return <Text>Loading account data...</Text>;
  }

  const sortedEventsData = eventsData.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <SafeAreaView style={{ flex: 1,backgroundColor: "white" }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {loading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : sortedEventsData.length > 0 ? (
          sortedEventsData.map((card) => (
            <TheirCard
              key={card.id}
              id={card.id}
              name={card.name}
              date={card.date}
              time={card.time}
              venue={card.venue}
              image_url={card.image_url}
              desc={card.description}
              selected={userData.selected_events?.includes(card.name) ?? false}
            />
          ))
        ) : (
          <View style={styles.noEventsContainer}>
            <Text style={styles.noEventsText}>No events found.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}


import { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { supabase } from "../../lib/supabase";
import { Button, Card, Text } from "react-native-paper";
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


  function EventCard(props) {


    const [modalDescVisible, setModalDescVisible] = useState(false);
    const [modalEventsVisible, setModalEventsVisible] = useState(false);
    const { user } = useAuth();
    const [followedButton, setFollowedButton] = useState(() => props.followed)
    const [eventsData, setEventsData] = useState([]);
  
    const handleViewDescPress = () => {
      setModalDescVisible(true);
    };

  
    const handleCloseDescModal = () => {
      setModalDescVisible(false);
    };


    const handleViewEventsPress = async () => {
        try {
          const { data: eventData, error: eventError } = await supabase
            .from('events')
            .select('*')
            .eq('user_id' , props.id);
          
          if (eventError) {
            console.error('Error fetching events:', eventError);
            return;
          }
          
          // Store the fetched events data in the component's state or pass it as props to the modal component
          
          // Open the modal
          setEventsData(eventData);
          setModalEventsVisible(true);
        } catch (error) {
          console.error('Error fetching events:', error);
        }
      };

    const handleCloseEventsModal = () => {
        setModalEventsVisible(false);
      };

  
    const handleFollowPress = async () => {
  
      console.log("pressed")
      console.log(props.id)
      
      try {
  
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
  
  
        const followed = userData.followed_accounts 
  
        let updatedFollowed;
  
         
        if (followed.includes(props.name)) {

          // Remove user from followed accounts
          updatedFollowed = followed.filter((account) => account !== props.name);

        } else {
  
          // Add user to followed accounts 
          updatedFollowed = [...followed, props.name];
        }
        
         
  
         console.log("this is updated followed list ", user.email  , updatedFollowed)
  
  
  
  
        const { data: updatedAccountData, error: updateAccountError } = await supabase
        .from('users')
        .update({
          followed_accounts: updatedFollowed,
        })
        .eq('id', user.id)
        .select();
  
        console.log("this is updated data", user.email , updatedAccountData)
  
  
  
        if (updateAccountError) {
          console.error('Error updating event:', updateAccountError);
        } else {
          setFollowedButton(!followedButton)  
          props.followed = followedButton
          console.log("this is followed after change" , user.email , updatedAccountData[0].followed_accounts)
        }

    } catch (error) {
        console.error('Error updating followed accounts:', error);
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
                <Button
                  onPress={handleFollowPress}
                  mode={ "outlined"}
                  style={{ backgroundColor: followedButton ? "yellow" : "white" }}
                >
                  Follow
                </Button>
                <Button onPress={handleViewDescPress} mode={ "outlined"} >View Description</Button>
                <Button onPress={handleViewEventsPress} mode={ "outlined"} >View Events</Button>
              </Card.Actions>
            </TouchableOpacity>
          </Card>
    
          <Modal visible={modalDescVisible} animationType="slide" onRequestClose={handleCloseDescModal}>
            <SafeAreaView style={styles.modalContainer}>
              <View>
                <Text>{props.desc}</Text>
                <Button onPress={handleCloseDescModal}>Close</Button>
              </View>
            </SafeAreaView>
          </Modal>


          <Modal visible={modalEventsVisible} animationType="slide" onRequestClose={handleCloseEventsModal}>
            <SafeAreaView style={styles.modalContainer}>
            {eventsData.map((event) => (
        <Text key={event.id}> {event.name} :  {event.desc}</Text>
      ))}

                <Button onPress={handleCloseEventsModal}>Back</Button>
            </SafeAreaView>
          </Modal>

        </>
      );
    }
    
    export default function BusinessAccounts() {
      const [usersData, setUsersData] = useState([]);
      const [myData, setMyData] = useState(null);
      const { user } = useAuth();
      const[residence, setResidence] = useState(null);
      useEffect(() => {
  
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
            setResidence(data.residence)
            setMyData(data);
          }
        }
      }
        fetchUserData();
      }, [user]);

      console.log("this is myyydata" , myData)
      useEffect(() => { 
        async function fetchUsersData() {
          const { data, error } = await supabase.from('users').select('*').eq("account_type", "Business")
          .eq("residence", residence)
          if (error) {
            console.error('Error fetching Business Accounts :', error);
          } else {
            setUsersData(data);
          }
        }   
            fetchUsersData();
            
      }, [user, residence]);

        console.log(usersData)
        console.log("middle")
    
      const sortedUsersData = usersData.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
      
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
    
      console.log("this is myData" , myData)
      return (
        <SafeAreaView>
          <ScrollView>
          
            {sortedUsersData.map((card) => (
              <EventCard
                key={card.id}
                id={card.id}
                name={card.name}
                profile_pic_url={card.profile_pic_url}
                desc={card.desc}
                followed={myData.followed_accounts?.includes(card.name) ?? false}
                // so issue is that userData is null rn. userData should be my data, auth id.
              />
            ))}
          </ScrollView>
        </SafeAreaView>
      );
    }
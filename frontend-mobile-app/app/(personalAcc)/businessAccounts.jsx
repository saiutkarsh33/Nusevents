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


    const [modalVisible, setModalVisible] = useState(false);
    const { user } = useAuth();
    const [followedButton, setFollowedButton] = useState(() => props.followed)
  
    const handleViewDescPress = () => {
      setModalVisible(true);
    };
  
    const handleCloseModal = () => {
      setModalVisible(false);
    };


    const handleViewEventsPress = () =>{}
  
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
    
    export default function BusinessAccounts() {
      const [usersData, setUsersData] = useState([]);

      const [myData, setMyData] = useState(null);
    
      const { user } = useAuth();


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
            setMyData(data);
          }
        }
      }
        fetchUserData();
      }, [user]);

      
      useEffect(() => { 
        async function fetchUsersData() {
          const { data, error } = await supabase.from('users').select('*').eq("account_type", "Business"
          )
          if (error) {
            console.error('Error fetching Business Accounts :', error);
          } else {
            setUsersData(data);
          }
        }   
            fetchUsersData();
            
      }, [user]);

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
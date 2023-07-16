import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
  RefreshControl,
  Image,
  FlatList,
} from "react-native";
import { supabase } from "../../lib/supabase";
import {
  Button,
  Card,
  Text,
  ActivityIndicator,
  Switch,
  Avatar,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/auth";

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: "20%",
    paddingHorizontal: "5%",
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

  eventDescCard: {
    marginTop: 30,
  },

  eventDescContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  fullImage: {
    width: "100%",
    height: "30%",
  },

  Text: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    marginVertical: 10,
  },

  Button: {
    marginTop: 16,
    backgroundColor: "cyan",
    alignSelf: "center",
  },
});

function EventCard(props) {
  // const [modalDescVisible, setModalDescVisible] = useState(false);
  const [modalEventsVisible, setModalEventsVisible] = useState(false);
  const { user } = useAuth();
  const [followedButton, setFollowedButton] = useState(() => props.followed);
  const [eventsData, setEventsData] = useState([]);

  // const handleViewDescPress = () => {
  //   setModalDescVisible(true);
  // };

  // const handleCloseDescModal = () => {
  //   setModalDescVisible(false);
  // };

  const handleViewEventsPress = async () => {
    try {
      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select("*")
        .eq("user_id", props.id);

      if (eventError) {
        console.error("Error fetching events:", eventError);
        return;
      }

      // Store the fetched events data in the component's state or pass it as props to the modal component

      // Open the modal
      setEventsData(eventData);
      setModalEventsVisible(true);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleCloseEventsModal = () => {
    setModalEventsVisible(false);
  };

  const handleFollowPress = async () => {
    console.log("pressed");
    console.log(props.id);

    try {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (userError) {
        console.error("Error fetching Account:", userError);
        return;
      } else {
        console.log("user fetched");
        console.log("this is user data before the change: ", userData);
      }

      const followed = userData.following;

      let updatedFollowed;

      if (followed.includes(props.name)) {
        // Remove user from followed accounts
        updatedFollowed = followed.filter((account) => account !== props.name);
      } else {
        // Add user to followed accounts
        updatedFollowed = [...followed, props.name];
      }

      console.log(
        "this is updated followed list ",
        user.email,
        updatedFollowed
      );

      const { data: updatedAccountData, error: updateAccountError } =
        await supabase
          .from("users")
          .update({
            following: updatedFollowed,
          })
          .eq("id", user.id)
          .select();

      console.log("this is updated data", user.email, updatedAccountData);

      if (updateAccountError) {
        console.error("Error updating event:", updateAccountError);
      } else {
        setFollowedButton(!followedButton);
        props.followed = followedButton;
        console.log(
          "this is followed after change",
          user.email,
          updatedAccountData[0].followed_accounts
        );
      }
    } catch (error) {
      console.error("Error updating followed accounts:", error);
    }
  };

  return (
    <>
      <Card style={styles.cardContainer} mode="outlined">
        <Card.Title title={props.name} titleStyle={styles.cardTitle} />
        {props.profile_pic_url ? (
          <Card.Cover
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
              No Image
            </Text>
          </View>
        )}

        <TouchableOpacity>
          <Card.Actions>
            {followedButton ? <Text>Following</Text> : <Text>Follow</Text>}
            <Switch value={followedButton} onValueChange={handleFollowPress} />
            <Button
              onPress={handleViewEventsPress}
              mode={"outlined"}
              style={{ backgroundColor: "cyan", marginLeft: 10 }}
            >
              Learn More
            </Button>
          </Card.Actions>
        </TouchableOpacity>
      </Card>

      <Modal
        visible={modalEventsVisible}
        animationType="slide"
        onRequestClose={handleCloseEventsModal}
        contentContainerStyle={{height: Dimensions.get('window').height}}
      >
        <SafeAreaView style={styles.modalContainer}>
          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
              alignSelf: "flex-start",
              marginBottom: 20,
            }}
          >
            {props.name}
          </Text>
          {props.profile_pic_url && (
            <Image
              source={{ uri: props.profile_pic_url }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          )}
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              alignSelf: "flex-start",
              marginTop: 10,
            }}
          >
            Description
          </Text>
          <Text
            variant="bodyLarge"
            style={{ alignSelf: "flex-start", marginTop: 10 }}
          >
            {props.description}
          </Text>
          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
              textDecorationLine: "underline",
              alignSelf: "flex-start",
              marginTop: 20,
            }}
          >
            Events
          </Text>

          <FlatList
            data={eventsData}
            renderItem={({ item }) => <Event event={item} />}
            style={{ width: "100%" }}
          />

          <Button onPress={handleCloseEventsModal} style={styles.Button}>
            Back
          </Button>
        </SafeAreaView>
      </Modal>
    </>
  );
}

function Event({ event }) {
  return (
    <Card key={event.id} style={styles.eventDescCard} mode="outlined">
      <Card.Title title={event.name} titleStyle={styles.cardTitle} />
      <Card.Content>
        <View style={styles.eventDescContainer}>
          <Avatar.Icon size={40} icon="account" color="#6c8aff" />
          <Text variant="bodyLarge">{event.creator}</Text>
        </View>
        <View style={styles.eventDescContainer}>
          <Avatar.Icon size={40} icon="calendar" color="#6c8aff" />
          <Text variant="bodyLarge">{event.date}</Text>
        </View>
        <View style={styles.eventDescContainer}>
          <Avatar.Icon size={40} icon="clock" color="#6c8aff" />
          <Text variant="bodyLarge">{event.time}</Text>
        </View>
        <View style={styles.eventDescContainer}>
          <Avatar.Icon size={40} icon="map-marker" color="#6c8aff" />
          <Text variant="bodyLarge">{event.venue}</Text>
        </View>
        <Text variant="bodyLarge" style={{ marginVertical: 10 }}>
          {event.description}
        </Text>
      </Card.Content>
    </Card>
  );
}

export default function BusinessAccounts() {
  const [usersData, setUsersData] = useState([]);
  const [myData, setMyData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  async function fetchData() {
    setRefreshing(true);
    setLoading(true);
    if (user) {
      const { data: myData, error: userDataError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (userDataError) {
        console.error("Error fetching user data:", userDataError);
      } else {
        console.log("Fetched my accs:", myData);
        setMyData(myData);

        const { data: businessAccountsData, error: businessAccountsError } =
          await supabase
            .from("users")
            .select("*")
            .eq("account_type", "Business")
            .eq("residence", myData.residence);

        if (businessAccountsError) {
          console.error(
            "Error fetching Business Accounts:",
            businessAccountsError
          );
        } else {
          console.log("Fetched Biz accs:", businessAccountsData);
          setUsersData(businessAccountsData);
        }
      }
    }

    setLoading(false);
  }
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
    fetchData(); // Call your fetchData function to fetch the latest data
    setRefreshing(false);
  };

  console.log("this is biz acc", usersData);
  console.log("middle");

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

  console.log("this is myData", myData);

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
        sortedUsersData.map((card) => (
          <EventCard
            key={card.id}
            id={card.id}
            name={card.name}
            profile_pic_url={card.profile_pic_url}
            description={card.description}
            followed={myData.following?.includes(card.name) ?? false}
          />
        ))
      )}
    </ScrollView>
  );
}

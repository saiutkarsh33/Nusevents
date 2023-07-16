import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
  RefreshControl,
  Image,
} from "react-native";
import { supabase } from "../../lib/supabase";
import {
  Button,
  Card,
  Text,
  ActivityIndicator,
  Avatar,
  Switch,
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
  eventCardName: {
    fontWeight: "bold",
    fontSize: 22,
    marginVertical: 10,
  },
  eventCardDate: {
    color: "red",
  },
  eventDescCard: {
    marginTop: 30,
    width: "100%",
  },

  eventDescContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  fullImage: {
    width: "100%",
    height: "30%",
  },

  closeButtonImage: {
    marginTop: 30,
    backgroundColor: "cyan",
  },

  closeButton: {
    marginTop: 16,
    backgroundColor: "cyan",
    alignSelf: "center",
  },
  noEventsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  noEventsText: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    marginVertical: 10,
  },
});

export function TheirCard(props) {
  // const [picVisible, setPicVisible] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedButton, setSelectedButton] = useState(() => props.selected);

  const { user } = useAuth();

  // const handleOpenPic = () => {
  //   setPicVisible(true);
  // };

  // const handleClosePic = () => {
  //   setPicVisible(false);
  // };

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
    console.log("pressed");
    console.log(props.id);

    try {
      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select("signups")
        .eq("id", props.id)
        .single();

      if (eventError) {
        console.error("Error fetching event:", eventError);
        return;
      } else {
        console.log("event fetched");
        console.log("this is eventdata before the change :", eventData);
      }

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

      const signups = eventData.signups;

      const selected = userData.selected_events;

      let updatedSignups;
      let updatedSelected;

      if (selected.includes(props.name)) {
        // Remove event from user's selected events
        updatedSelected = selected.filter(
          (eventName) => eventName !== props.name
        );

        // Remove user from event signups
        updatedSignups = signups.filter((signup) => signup !== userData.name);
      } else {
        // Add event to user's selected events
        updatedSelected = [...selected, props.name];

        // Add user to event signups
        updatedSignups = [...signups, userData.name];
      }

      console.log("this is updated signup", props.name, updatedSignups);

      // const updatedSignups = [...signups, accountData.name];

      // const updatedSelected = [...selected, eventData.name];

      const { data: updatedEventData, error: updateEventError } = await supabase
        .from("events")
        .update({
          signups: updatedSignups,
        })
        .eq("id", props.id)
        .select();

      console.log("this is updated data", props.name, updatedEventData);

      if (updateEventError) {
        console.error("Error updating event:", updateEventError);
      } else {
        console.log(
          "this is signups after change",
          props.name,
          updatedEventData[0].signups
        );
      }

      const { data: updatedUserData, error: updateUserError } = await supabase
        .from("users")
        .update({
          selected_events: updatedSelected,
        })
        .eq("id", user.id)
        .select();

      if (updateUserError) {
        console.error("Error updating users:", updateUserError);
      } else {
        setSelectedButton(!selectedButton);
        props.selected = selectedButton;
      }

      console.log("this is final selected", selectedButton);
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  return (
    <>
      <Card style={styles.cardContainer} mode="outlined">
        <Card.Title title={props.creator} titleStyle={styles.cardTitle} />
        {props.image_url ? (
          <Card.Cover
            style={styles.cardCover}
            source={{ uri: props.image_url }}
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
        <Card.Content>
          <Text style={styles.eventCardName}>{props.name}</Text>
          <Text style={styles.eventCardDate}>Date: {props.date}</Text>
        </Card.Content>

        <TouchableOpacity>
          <Card.Actions>
            {selectedButton ? <Text>Joined</Text> : <Text>Join</Text>}
            <Switch value={selectedButton} onValueChange={handleImInPress} />
            <Button
              onPress={handleViewMorePress}
              mode="outlined"
              style={{ backgroundColor: "cyan", marginLeft: 10 }}
            >
              Learn More
            </Button>
          </Card.Actions>
        </TouchableOpacity>
      </Card>

      <EventLearnMoreModal
        modalVisible={modalVisible}
        handleCloseModal={handleCloseModal}
        props={props}
      />
    </>
  );
}

function EventLearnMoreModal({ modalVisible, handleCloseModal, props }) {
  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      onRequestClose={handleCloseModal}
      style={styles.modalContainer}
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
        {props.image_url && (
          <Image
            source={{ uri: props.image_url }}
            style={styles.fullImage}
            resizeMode="contain"
          />
        )}
        <Card style={styles.eventDescCard} mode="outlined">
          <Card.Title title="Event Description" titleStyle={styles.cardTitle} />
          <Card.Content>
            <View style={styles.eventDescContainer}>
              <Avatar.Icon size={40} icon="account" color="#6c8aff" />
              <Text variant="bodyLarge">{props.creator}</Text>
            </View>
            <View style={styles.eventDescContainer}>
              <Avatar.Icon size={40} icon="calendar" color="#6c8aff" />
              <Text variant="bodyLarge">{props.date}</Text>
            </View>
            <View style={styles.eventDescContainer}>
              <Avatar.Icon size={40} icon="clock" color="#6c8aff" />
              <Text variant="bodyLarge">{props.time}</Text>
            </View>
            <View style={styles.eventDescContainer}>
              <Avatar.Icon size={40} icon="map-marker" color="#6c8aff" />
              <Text variant="bodyLarge">{props.venue}</Text>
            </View>
            <Text variant="bodyLarge" style={{ marginVertical: 10 }}>
              {props.desc}
            </Text>
          </Card.Content>
        </Card>
        <Button onPress={handleCloseModal} style={styles.closeButton}>
          Close
        </Button>
      </SafeAreaView>
    </Modal>
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
        .from("events")
        .select("*")
        .eq("residence", residence)
        .in("creator", followed);

      if (error) {
        console.error("Error fetching events:", error);
      } else {
        setEventsData(data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function fetchUserData() {
    if (user) {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error) {
        console.error("Error fetching user data:", error);
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
    await fetchUserData();
    await fetchData(); // Wait for fetchData to complete
    setRefreshing(false);
  };

  if (!userData) {
    return <Text>Loading account data...</Text>;
  }

  const sortedEventsData = eventsData.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, backgroundColor: "white" }}
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
            creator={card.creator}
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
  );
}

import { Calendar } from "react-native-calendars";
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  RefreshControl,
  ScrollView,
  View,
  FlatList,
} from "react-native";
import {
  Button,
  Text,
  ActivityIndicator,
  Card,
  Avatar,
} from "react-native-paper";
import { supabase } from "../../lib/supabase";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/auth";

const customMarkingType = {
  customStyles: {
    container: {
      backgroundColor: 'cyan', 
      borderRadius: 16, 
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      color: 'black', 
      fontWeight: 'bold',
    },
  },
};


const styles = StyleSheet.create({
  Text: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    textAlignVertical: "center",
    marginVertical: 10,
  },

  Button: {
    marginTop: 16,
    backgroundColor: "cyan",
    alignSelf: "center",
  },
  popUpContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: "10%",
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
  noEventsText: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    marginVertical: 10,
  }, 
});

export default function EventsCalendar() {
  const [eventsData, setEventsData] = useState([]);
  const [userData, setUserData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [selectedEventsData, setSelectedEventsData] = useState([]);



  // Fetch data from Supabase
  async function fetchData() {
    if (user) {
      setLoading(true);
      try {
        const { data: allEvents, error: error } = await supabase.from("events").select("*");
        if (error) {
          console.error("Error fetching events:", error);
        } else {
          setEventsData(allEvents);
        }

        const { data: userData2, error: userError } = await supabase
          .from("users")
          .select("selected_events")
          .eq("id", user.id)
          .single();

        if (userError) {
          console.error("Error fetching account data:", userError);
        } else {
          setUserData(userData2);
          const selectedEventsNames = userData2.selected_events || [];
          
          const selectedEvents = allEvents.filter(event => 
            selectedEventsNames.includes(event.name)  // Assuming the name property of an event is called 'name'
          );
  
          // Here, you can set the filtered events to another state or use them as needed
          setSelectedEventsData(selectedEvents);

        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
        console.log(userData)
         // Set refreshing state to false after data fetch
      }
    }
  }
  useEffect(() => {
    fetchData();
  }, [user]);

  const markedDates = {};

  // Get the dates of each event selected

  eventsData.forEach((event) => {
    if (userData && userData.selected_events.includes(event.name)) {
      const eventDate = event.date;
  
      if (!markedDates[eventDate]) {
        markedDates[eventDate] = customMarkingType;
      }
    }
  });
  

  // open up relevant modals when day is pressed

  const handleDayPress = (day) => {
    const { dateString } = day;

    if (markedDates[dateString]) {
      if (selectedDate && selectedDate === dateString) {
        setIsPopupVisible(true);
      } else {
        setSelectedDate(dateString);
        setIsPopupVisible(true);
      }
    }
  };

  useEffect(() => {
    const getEventsForDate = async (selectedDate) => {
      if (!selectedDate) {
        return []; // Return empty array when no date is selected
      }

      try {
        const { data: events, error } = await supabase
          .from("events")
          .select("*")
          .eq("date", selectedDate);

        if (error) {
          console.error("Error fetching events:", error);
          return [];
        }

        const filteredEvents = events.filter(
          (event) => userData && userData.selected_events.includes(event.name)
        );

        return filteredEvents;
      } catch (error) {
        console.error("Error fetching events:", error);
        return [];
      }
    };

    // Get the actual events for eachs selected date, to appear in the modal

    async function fetchEventsForSelectedDate() {
      try {
        setEventsForSelectedDate([]); // Set events to an empty array first
        const events = await getEventsForDate(selectedDate);
        console.log("Events for selected date:", events);
        setEventsForSelectedDate(events);
      } catch (error) {
        console.error("Error fetching events:", error);
        // Handle the error if needed
      }
    }

    if (selectedDate) {
      fetchEventsForSelectedDate();
    }
  }, [selectedDate, userData]);

  const EventPopup = () => {
    // Get the list of events for the selected date from your events data
    if (!eventsForSelectedDate) {
      // Handle the case when events data is not yet available
      return null;
    }

    console.log(eventsForSelectedDate);

    return (
      <SafeAreaView>
        {eventsForSelectedDate.length > 0 && (
          <Modal visible={isPopupVisible} animationType="slide">
            <SafeAreaView style={styles.popUpContainer}>
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: "bold",
                  textDecorationLine: "underline",
                  alignSelf: "center",
                  marginTop: 20,
                }}
              >
                Events
              </Text>
              <FlatList
                data={eventsForSelectedDate}
                renderItem={({ item }) => <Event event={item} />}
                style={{ width: "100%" }}
              />
              <Button
                onPress={() => setIsPopupVisible(false)}
                style={styles.Button}
              >
                Close
              </Button>
            </SafeAreaView>
          </Modal>
        )}
      </SafeAreaView>
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setSelectedDate(null);
    await fetchData();
  };

  const sortedEventsData = selectedEventsData && Array.isArray(selectedEventsData) 
    ? selectedEventsData.sort((a, b) => new Date(a.date) - new Date(b.date)) 
    : [];


  return (
    <ScrollView
    style={{ backgroundColor: "white" }} 
      contentContainerStyle={{ backgroundColor: "white" }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {loading ? ( // Render the loading indicator when loading is true
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <>
          <Calendar  markingType={'custom'} markedDates={markedDates} onDayPress={handleDayPress} />
          <EventPopup />
        </>
      )}

         <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
              textDecorationLine: "underline",
              alignSelf: "center",
              marginTop: 20,
              marginLeft:10
            }}
          >
            Events Signed Up
          </Text>


             

          
          {sortedEventsData && sortedEventsData.length > 0 ? (
        sortedEventsData.map((event, index) => <Event key={index} event={event} />)
      ) : (
        <Text style={styles.noEventsText}>No events found. Sign up for one!</Text>
      )}
          
    </ScrollView>
  );
}

// Below is the code for the events themselves, the ones that are  shown when the date is pressed,

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

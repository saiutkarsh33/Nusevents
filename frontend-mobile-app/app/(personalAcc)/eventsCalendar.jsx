import { Calendar } from "react-native-calendars";
import { Modal, SafeAreaView, StyleSheet, RefreshControl, ScrollView } from "react-native";
import { Button, Text, ActivityIndicator } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/auth";

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
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
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

  
    // Fetch data from Supabase
    async function fetchData() {
      if (user) {
        setLoading(true); 
        try {
          const { data, error } = await supabase.from("events").select("*");
          if (error) {
            console.error("Error fetching events:", error);
          } else {
            setEventsData(data);
          }

          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("selected_events")
            .eq("id", user.id)
            .single();

          if (userError) {
            console.error("Error fetching account data:", userError);
          } else {
            setUserData(userData);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false); 
          setRefreshing(false); // Set refreshing state to false after data fetch
        }
      }
    }
   useEffect(() => {
    fetchData();
   }, [user])
    
  

  const markedDates = {};

  eventsData.forEach((event) => {
    if (userData && userData.selected_events.includes(event.name)) {
      const eventDate = event.date;

      if (!markedDates[eventDate]) {
        markedDates[eventDate] = {
          marked: true,
          dotColor: "green",
        };
      } else {
        // If the date is already marked, update the dotColor to 'green'
        markedDates[eventDate].dotColor = "green";
      }
    }
  });

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
      <SafeAreaView style={{ flex: 1 }}>
        {eventsForSelectedDate.length > 0 && (
          <Modal visible={isPopupVisible} animationType="slide">
            <SafeAreaView style={styles.popUpContainer}>
              {/* Render the events data in the popup */}
              {eventsForSelectedDate.map((event, index) => (
                <Text key={index} style={styles.Text} >
                  {`${index + 1}. `}
                  {event.name} at {event.time} by {event.creator}
                </Text>
              ))}
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {loading ? ( // Render the loading indicator when loading is true
          <ActivityIndicator size="large" color="blue" />
        ) : (
          <>
            <Calendar markedDates={markedDates} onDayPress={handleDayPress} />
            <EventPopup />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}



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
import { useState, useEffect } from "react";

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
});

// This is a simpler version of EventsCalendar, for testing

export function EventsCalendar() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  // using sample event named 'Test Event' for testing, on the 20 July 2023

  const [eventsForSelectedDate, setEventsForSelectedDate] = useState([
    { name: "Test Event" },
  ]);

  const markedDates = {
    "2023-07-20": { marked: true },
    "2023-08-20": { marked: true },
  };

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

  return (
    <ScrollView>
      <>
        <Calendar markedDates={markedDates} onDayPress={handleDayPress} />
        <EventPopup />
      </>
    </ScrollView>
  );
}

// Below is the code for the events themselves, the ones that are  shown when the date is pressed,

function Event({ event }) {
  return (
    <Card key={event.id} style={styles.eventDescCard} mode="outlined">
      <Card.Title title={event.name} titleStyle={styles.cardTitle} />
    </Card>
  );
}

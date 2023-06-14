import { Calendar } from 'react-native-calendars';
import { Modal, Button, Text, SafeAreaView } from "react-native";
import { supabase } from "../../lib/supabase";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/auth";

export default function EventsCalendar() {
  const [eventsData, setEventsData] = useState([]);
  const [userData, setUserData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState([]);

  const { user } = useAuth();

  useEffect(() => {
    // Fetch data from Supabase
    async function fetchData() {
      try {
        const { data, error } = await supabase.from('events').select('*');
        if (error) {
          console.error('Error fetching events:', error);
        } else {
          setEventsData(data);
        }

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('selected_events')
          .eq('id', user.id)
          .single();

        if (userError) {
          console.error('Error fetching account data:', userError);
        } else {
          setUserData(userData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [user]);

  const markedDates = {};

  eventsData.forEach((event) => {
    if (userData && userData.selected_events.includes(event.name)) {
      const eventDate = event.date;

      if (!markedDates[eventDate]) {
        markedDates[eventDate] = {
          marked: true,
          dotColor: 'green'
        };
      } else {
        // If the date is already marked, update the dotColor to 'green'
        markedDates[eventDate].dotColor = 'green';
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
          .from('events')
          .select('name')
          .eq('date', selectedDate);

        if (error) {
          console.error('Error fetching events:', error);
          return [];
        }

        const filteredEvents = events.filter((event) =>
          userData && userData.selected_events.includes(event.name)
        );

        return filteredEvents;
      } catch (error) {
        console.error('Error fetching events:', error);
        return [];
      }
    };

    async function fetchEventsForSelectedDate() {
      try {
        const events = await getEventsForDate(selectedDate);
        console.log('Events for selected date:', events);
        setEventsForSelectedDate(events);
      } catch (error) {
        console.error('Error fetching events:', error);
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
            <SafeAreaView style={{ flex: 1 }}>
              {/* Render the events data in the popup */}
              {eventsForSelectedDate.map((event, index) => (
                <Text key={index}> {event.name} </Text>
              ))}
              <Button title="Close" onPress={() => setIsPopupVisible(false)} />
            </SafeAreaView>
          </Modal>
        )}
      </SafeAreaView>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Calendar markedDates={markedDates} onDayPress={handleDayPress} />
      <EventPopup />
    </SafeAreaView>
  );
}


  //const handleDayPress = (day) => {
  //  const selectedDate = day.dateString;
  //  const selectedEvents = events.filter((event) => event.date === selectedDate);
  //  console.log('Selected events:', selectedEvents);
    // For now I'm just console.logging the dates
 // };

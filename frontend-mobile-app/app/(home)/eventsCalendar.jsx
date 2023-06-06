import { Calendar } from 'react-native-calendars';
import {View, Modal, Button, Text, SafeAreaView } from "react-native";
import { supabase } from "../../lib/supabase";
import { useState, useEffect} from "react";



export default function EventsCalendar() {
    
  const [eventsData, setEventsData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState([]);

  useEffect(() => {
    // Fetch data from Supabase. Do edit this according to the actual database in supabase. *******
    async function fetchData() {
      const { data,  error } = await supabase.from('events').select('*');
      if (error) {
        console.error('Error fetching events:', error);
      } else {
        setEventsData(data);
      }
    }
    fetchData();
  }, []);

    const markedDates = {};

    eventsData.forEach((event) => {

    if (event.selected === true) {  
    const eventDate = event.date; 


    if (!markedDates[eventDate] ) {
      markedDates[eventDate] = {
        marked: true, dotColor: 'green', selected: true
      };
    }
  }});

 

  const handleDayPress = (day) => {
  const { dateString } = day;
  setSelectedDate(dateString);
  setIsPopupVisible(true);
};

  const getEventsForDate = async (selectedDate) => {

    if (!selectedDate) {
      return []; // Return empty array when no date is selected
    }

    try {
      const { data: events, error } = await supabase
        .from('events')
        .select('name')
        .eq("selected", true)
        .eq('date', selectedDate);
        
      if (error) {
        console.error('Error fetching events:', error);
        return [];
      }
      
      return events;
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  };

  useEffect(() => {
    async function fetchEventsForSelectedDate() {
      const events = await getEventsForDate(selectedDate);
      setEventsForSelectedDate(events);
    }

    if (selectedDate) {
      fetchEventsForSelectedDate();
    }
  }, [selectedDate]);


  const EventPopup = () => {
    // Get the list of events for the selected date from your events data
    
    if (!eventsForSelectedDate) {
      // Handle the case when events data is not yet available
      return null;
    }

    return (
      <SafeAreaView style={{ flex: 1 }} >
      <Modal visible={isPopupVisible}  animationType="slide">
        <SafeAreaView style={{ flex: 1 }}>
          {/* Render the events data in the popup */}
          {eventsForSelectedDate.map((event) => (
            <Text key={event.id}>{event.title}</Text>
          ))}
          <Button title="Close" onPress={() => setIsPopupVisible(false)} />
        </SafeAreaView>
      </Modal>
      </SafeAreaView>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }} >
      <Calendar
      markedDates={markedDates}
      onDayPress= {handleDayPress}
    />
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

import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { supabase } from "../../lib/supabase";
import { Button, Card, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
  },
});

function MyCard(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState(props.selected);

  const handleViewMorePress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleImInPress = async () => {
    try {
      const newSelected = !selected;

      const { error } = await supabase
        .from("events")
        .update({ selected: newSelected })
        .eq("id", props.id);

      if (error) {
        console.error("Error updating event:", error);
      } else {
        setSelected(newSelected);
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  return (
    <>
      <Card>
        <Card.Content>
          <Text variant="titleLarge">
            {props.name} • {props.date}
          </Text>
          <Text variant="bodyMedium">
            Time: {props.time} • Venue: {props.venue}
          </Text>
        </Card.Content>

        <TouchableOpacity>
          <Card.Cover source={{ uri: props.image_url }} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Card.Actions>
            <Button
              onPress={handleImInPress}
              mode={selected ? "contained" : "outlined"}
              style={{ backgroundColor: selected ? "yellow" : "white" }}
            >
              I&apos;m in
            </Button>
            <Button onPress={handleViewMorePress}>View More</Button>
          </Card.Actions>
        </TouchableOpacity>
      </Card>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
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

export default function EventsPage() {
  const [eventsData, setEventsData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from("events").select("*");

      if (error) {
        console.error("Error fetching events:", error);
      } else {
        setEventsData(data);
      }
    }
    fetchData();
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        {eventsData.map((card) => (
          <MyCard
            key={card.id}
            id={card.id}
            name={card.name}
            date={card.date}
            time={card.time}
            venue={card.venue}
            selected={card.selected}
            important={card.important}
            image_url={card.image_url}
            desc={card.desc}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

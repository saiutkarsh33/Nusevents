import { Text} from "react-native";
import {  SafeAreaView } from "react-native-safe-area-context";

// Show description of event in another page. 
// I think good to figure out how this works and how to put in the props element in a different page,
// but if complicated and you afre unable to find, can just make it into another pop up like the eventsCalendar.


export default function EventsDesc(props) {
    return (
        <SafeAreaView>
            <Text>
                {props.description}
            </Text>
        </SafeAreaView>
     )
    }
    
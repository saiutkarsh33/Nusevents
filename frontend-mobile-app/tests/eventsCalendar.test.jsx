import {
  render,
  fireEvent,
  waitFor,
  screen,
  cleanup,
} from "@testing-library/react-native";
import { EventsCalendar } from "./files/eventsCalendarTest.jsx";
import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  FlatList,
} from "react-native";

import {
  Button,
  Card,
  Text,
  ActivityIndicator,
  TextInput,
} from "react-native-paper";

import { act } from "react-test-renderer";

// Creating View Events page tests

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: "SafeAreaView",
}));

jest.mock("../contexts/auth", () => ({
  useAuth: jest.fn().mockReturnValue({ user: { id: "1234" } }),
}));

// hardcoded the date, 20 July & 20 August to have a sample event named 'Test Event'

test("Pressing on a day results in 'Events' showing up", async () => {
  const { getByText, findByText } = render(<EventsCalendar />);

  // Get the date 20 July / August and press it
  fireEvent.press(getByText("20"));

  // Use findByText which returns a Promise that resolves when the element is found
  // If the element is not found within the timeout, the Promise rejects
  const events = await findByText("Events");

  expect(events).toBeTruthy();
});

test("Pressing on a day results in the sample event 'Test Event' showing up", async () => {
  const { getByText, findByText } = render(<EventsCalendar />);

  // Get the date 20 July / August and press it
  fireEvent.press(getByText("20"));

  // Use findByText which returns a Promise that resolves when the element is found
  // If the element is not found within the timeout, the Promise rejects
  const events = await findByText("Test Event");

  expect(events).toBeTruthy();
});

import {
  render,
  fireEvent,
  waitFor,
  screen,
  cleanup,
} from "@testing-library/react-native";
import {
  EventLearnMoreModal,
  TheirCard,
  EventsPage,
} from "./files/viewEventsTest.jsx";
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

test("Shows the name of creator, Test CCA, of sample created event, Test Event Name, on the View Events page", () => {
  render(<EventsPage />);

  // Check if the text "Test CCA" exists in the document
  expect(screen.getByText("Test CCA")).toBeTruthy();
});

test("Shows the sample created event, Test Event Name, on the View Events page", () => {
  render(<EventsPage />);

  // Check if the text "Test Event Name" exists in the document
  expect(screen.getByText("Test Event Name")).toBeTruthy();
});

test("'Learn More' button press results in 'Event Description' showing up", async () => {
  const { getByText, findByText } = render(<EventsPage />);

  // Get the Learn More button and press it
  fireEvent.press(getByText("Learn More"));

  // Use findByText which returns a Promise that resolves when the element is found
  // If the element is not found within the timeout, the Promise rejects
  const eventDescription = await findByText("Event Description");

  expect(eventDescription).toBeTruthy();
});

test("'Chat' button press results in 'Event Chat' showing up", async () => {
  const { getByText, findByText } = render(<EventsPage />);

  // Get the Chat button and press it
  fireEvent.press(getByText("Chat"));

  // Use findByText which returns a Promise that resolves when the element is found
  // If the element is not found within the timeout, the Promise rejects
  const chat = await findByText("Event Chat");

  expect(chat).toBeTruthy();
});

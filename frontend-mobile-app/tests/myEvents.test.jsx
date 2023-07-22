import {
  render,
  fireEvent,
  waitFor,
  screen,
  cleanup,
} from "@testing-library/react-native";
import { MyCard, MyEvents } from "./files/myEventsTest.jsx";
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

// Creating my Events page tests

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

test("Shows the sample created event, Test Event Name, on the My Events page", () => {
  render(<MyEvents />);

  // Check if the text "Test Event Name" exists in the document
  expect(screen.getByText("Test Event Name")).toBeTruthy();
});

test("'Signups' button press results in 'Total Signups' showing up", async () => {
  const { getByText, findByText } = render(<MyEvents />);

  // Get the Signups button and press it
  fireEvent.press(getByText("Signups"));

  // Use findByText which returns a Promise that resolves when the element is found
  // If the element is not found within the timeout, the Promise rejects
  const totalSignups = await findByText("Total Signups");

  expect(totalSignups).toBeTruthy();
});

test("'Chat' button press results in 'Chat' showing up", async () => {
  const { getByText, findByText } = render(<MyEvents />);

  // Get the Chat button and press it
  fireEvent.press(getByText("Chat"));

  // Use findByText which returns a Promise that resolves when the element is found
  // If the element is not found within the timeout, the Promise rejects
  const chat = await findByText("Event Chat");

  expect(chat).toBeTruthy();
});

test("'Edit' button press results in 'Edit the values accordingly' showing up", async () => {
  const { getByText, findByText } = render(<MyEvents />);

  // Get the Edit button and press it
  fireEvent.press(getByText("Edit"));

  // Use findByText which returns a Promise that resolves when the element is found
  // If the element is not found within the timeout, the Promise rejects
  const editValuesText = await findByText("Edit the values accordingly");

  expect(editValuesText).toBeTruthy();
});

test("'Edit' button press results in 'Delete Event' showing up", async () => {
  const { getByText, findByText } = render(<MyEvents />);

  // Get the Edit button and press it
  fireEvent.press(getByText("Edit"));

  // Use findByText which returns a Promise that resolves when the element is found
  // If the element is not found within the timeout, the Promise rejects
  const deleteEventText = await findByText("Delete Event");

  expect(deleteEventText).toBeTruthy();
});

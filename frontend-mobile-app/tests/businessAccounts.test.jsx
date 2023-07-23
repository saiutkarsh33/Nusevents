import {
  render,
  fireEvent,
  waitFor,
  screen,
  cleanup,
} from "@testing-library/react-native";
import { BusinessAccounts } from "./files/businessAccountsTest.jsx";
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

test("Shows the name of CCA, Test CCA on the View CCAs page", () => {
  render(<BusinessAccounts />);

  // Check if the text "Test CCA" exists in the document
  expect(screen.getByText("Test CCA")).toBeTruthy();
});

test("'Learn More' button press results in 'Event Description' showing up", async () => {
  const { getByText, findByText } = render(<BusinessAccounts />);

  // Get the Learn More button and press it
  fireEvent.press(getByText("Learn More"));

  // Use findByText which returns a Promise that resolves when the element is found
  // If the element is not found within the timeout, the Promise rejects
  const ccaDescription = await findByText("Description");

  expect(ccaDescription).toBeTruthy();
});

test("'Follow' switch press results in 'Following' showing up", async () => {
  const { getByTestId, findByText } = render(<BusinessAccounts />);

  // Get the Follow switch and click it
  fireEvent(getByTestId("followSwitch"), "valueChange", true);

  // Use findByText which returns a Promise that resolves when the element is found
  // If the element is not found within the timeout, the Promise rejects
  const followingText = await findByText("Following");

  expect(followingText).toBeTruthy();
});

test("'Follow' switch pressed twice results in 'Follow' showing up", async () => {
  const { getByTestId, findByText } = render(<BusinessAccounts />);

  // Get the Follow switch and click it
  fireEvent(getByTestId("followSwitch"), "valueChange", true);
  fireEvent(getByTestId("followSwitch"), "valueChange", true);

  // Use findByText which returns a Promise that resolves when the element is found
  // If the element is not found within the timeout, the Promise rejects
  const followingText = await findByText("Follow");

  expect(followingText).toBeTruthy();
});



import { render, fireEvent, waitFor, screen, cleanup } from '@testing-library/react-native';
import  { ProfileCard, ProfileScreen } from './files/profileTest.jsx';
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

// Creating Profile page tests

afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });



  
  jest.mock('react-native-safe-area-context', () => ({
    SafeAreaView: 'SafeAreaView',
  }));
  
  
  jest.mock('../contexts/auth', () => ({
    useAuth: jest.fn().mockReturnValue({ user: { id: '1234' } }),
  }));

  test("Shows the sample profile, Sai, on the Profile page", () => {
    render(<ProfileScreen />);
    
    // Check if the text "Test Event Name" exists in the document
    expect(screen.getByText('Sai')).toBeTruthy();
  });

  test("'Edit' button press results in 'Edit the values accordingly' showing up", async () => {
    const { getByText, findByText } = render(<ProfileScreen />);
    
    // Get the Edit button and press it
    fireEvent.press(getByText('Edit'));
    
    // Use findByText which returns a Promise that resolves when the element is found
    // If the element is not found within the timeout, the Promise rejects
    const editValuesText = await findByText('Edit the values accordingly');
    
    expect(editValuesText).toBeTruthy();
  });

 

  test("'Change Password' button press results in 'Fill in below to Change Password' showing up", async () => {
    const { getByText, findByText } = render(<ProfileScreen />);
    
    // Get the Edit button and press it
    fireEvent.press(getByText('Change Password'));
    
    // Use findByText which returns a Promise that resolves when the element is found
    // If the element is not found within the timeout, the Promise rejects
    const editValuesText = await findByText('Fill in below to Change Password');
    
    expect(editValuesText).toBeTruthy();
  });

  test('shows an error when the password is submitted with less than 6 characters ', async () => {
    const { getByTestId, findByText, getByText } = render(<ProfileScreen />);

    fireEvent.press(getByText('Change Password'));
  
    // Fill in only the event name
    const eventNameInput = getByTestId('password');
    fireEvent.changeText(eventNameInput, 'a');
  
    fireEvent.press(getByText('Submit'));
  
    // Wait for error message to appear
    const errorMessage = await findByText("Password must be at least 6 characters long");
    
    expect(errorMessage).toBeTruthy();
  });

  test('shows an error when the password and confirm password are not the same ', async () => {
    const { getByTestId, findByText, getByText } = render(<ProfileScreen />);

    fireEvent.press(getByText('Change Password'));
  
    // Fill in only the event name
    const eventNameInput = getByTestId('password');
    fireEvent.changeText(eventNameInput, '123456');

    const eventNameInput2 = getByTestId('confirmPassword');
    fireEvent.changeText(eventNameInput2, '1234567');
  
    fireEvent.press(getByText('Submit'));
  
    // Wait for error message to appear
    const errorMessage = await findByText("Password does not match");
    
    expect(errorMessage).toBeTruthy();
  });

  test('shows an error when the password and confirm password are not the same ', async () => {
    const { getByTestId, findByText, getByText } = render(<ProfileScreen />);

    fireEvent.press(getByText('Change Password'));
  
    // Fill in only the event name
    const eventNameInput = getByTestId('password');
    fireEvent.changeText(eventNameInput, '123456');

    const eventNameInput2 = getByTestId('confirmPassword');
    fireEvent.changeText(eventNameInput2, '1234567');
  
    fireEvent.press(getByText('Submit'));
  
    // Wait for error message to appear
    const errorMessage = await findByText("Password does not match");
    
    expect(errorMessage).toBeTruthy();
  });

  test('When u change password and press back you go back to profile ', async () => {
    const { getByTestId, findByText, getByText } = render(<ProfileScreen />);

    fireEvent.press(getByText('Change Password'));
  
    // Fill in only the event name
  
    fireEvent.press(getByText('Back'));
  
    expect(screen.getByText('Sai')).toBeTruthy();
  });

  test("There is a logout button on the screen ", () => {
    render(<ProfileScreen />);
    
    // Check if the text "Test Event Name" exists in the document
    expect(screen.getByText('Logout')).toBeTruthy();
  });
  
  test("There is a Delete Account button on the screen ", () => {
    render(<ProfileScreen />);
    
    // Check if the text "Test Event Name" exists in the document
    expect(screen.getByText('Delete Account')).toBeTruthy();
  });


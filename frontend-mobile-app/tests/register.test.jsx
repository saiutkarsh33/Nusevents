import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { supabase } from "../lib/supabase";
import {Registerr} from '../app/(auth)/registerr';
//import { Dropdown } from 'react-native-element-dropdown';


jest.mock("react-native-paper", () => ({
    Text: 'Text',
    TextInput: 'TextInput',
    ActivityIndicator: 'ActivityIndicator',
    Button: 'Button',
  }));
  
  //jest.mock("react-native-element-dropdown", () => 'Dropdown');
  
  jest.mock("react-native-safe-area-context", () => ({
    SafeAreaView: 'SafeAreaView',
  }));
  

jest.mock("../lib/supabase", () => ({
  auth: {
    signUp: jest.fn(),
  }
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
}));

jest.mock('react-native-element-dropdown', () => {
    return jest.fn(() => null);  // mock component returns null
  });

jest.mock('react-native-element-dropdown', () => {
  const { Text } = require('react-native');
  return {
    __esModule: true,
    default: (props) => {
      return <Text testID="dropdown">{props.placeholder}</Text>
    }
  };
});

test('shows an email cannot be empty when all of the fields are empty', async () => {
    const { getByText, getByPlaceholderText, queryByText, getByTestId, findByText } = render(<Registerr />);
  
    const registerButton = getByTestId('submitButton');
  
    fireEvent.press(registerButton); // This simulates a button click
  
    await waitFor(() => findByText('Email cannot be empty')); // This waits for the error message to appear
  });
  
  test('shows a name cannot be empty when all of the fields are empty except for email', async () => {
    const { getByPlaceholderText, getByTestId, findByText } = render(<Registerr />);
    
    const registerButton = getByTestId('submitButton');
    const emailInput = getByPlaceholderText('Email');
  
    fireEvent.changeText(emailInput, 'test@email.com'); // This simulates entering the email
    
    fireEvent.press(registerButton); // This simulates a button click
    
    // It could take a while until the error message is displayed
    // Use waitFor function to wait until the error message is in the document
    await waitFor(() => {
      expect(findByText('Name cannot be empty')).toBeTruthy();
    });
  });
  








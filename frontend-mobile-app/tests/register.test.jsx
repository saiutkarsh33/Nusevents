import { render, fireEvent, waitFor, cleanup} from '@testing-library/react-native';
import { supabase } from "../lib/supabase";
import { RegisterTest } from './files/registerTest.jsx';


// Creating register page tests

afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });



jest.mock("react-native-paper", () => ({
    Text: 'Text',
    TextInput: 'TextInput',
    ActivityIndicator: 'ActivityIndicator',
    Button: 'Button',
  }));
  
  
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
    const { getByText, getByPlaceholderText, queryByText, getByTestId } = render(<RegisterTest />);
  
    const registerButton = getByTestId('submitButton');
  
    fireEvent.press(registerButton); // This simulates a button click
  
    await waitFor(() => getByText('Email cannot be empty')); // This waits for the error message to appear
  });
  
  test('shows a name cannot be empty when all of the fields are empty except for email', async () => {
    const { getByPlaceholderText, getByTestId, getByText, findByText } = render(<RegisterTest />);
    
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
  

  test('shows a password does not match error when the password and confirm password do not match', async () => {
    const { getByPlaceholderText, getByTestId, getByText } = render(<RegisterTest />);
    
    const registerButton = getByTestId('submitButton');
    const emailInput = getByPlaceholderText('Email');
    const nameInput = getByPlaceholderText('Name');
    const passwordInput = getByPlaceholderText('Password');
    const confirmPasswordInput = getByPlaceholderText('Confirm Password');
  
    fireEvent.changeText(emailInput, 'test@email.com'); // This simulates entering the email
    fireEvent.changeText(nameInput, 'Test User'); // This simulates entering the name
    fireEvent.changeText(passwordInput, 'password123'); // This simulates entering the password
    fireEvent.changeText(confirmPasswordInput, 'password321'); // This simulates entering a different password in confirm password
  
    fireEvent.press(registerButton); // This simulates a button click
    
    // It could take a while until the error message is displayed
    // Use waitFor function to wait until the error message is in the document
    await waitFor(() => {
      expect(getByText('Password does not match')).toBeTruthy();
    });
  });








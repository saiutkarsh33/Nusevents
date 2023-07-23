import { render, fireEvent, waitFor, cleanup } from '@testing-library/react-native';
import { useRouter } from "expo-router";
import LoginPage from '../app/(auth)/login';
import { supabase } from "../lib/supabase";

// Testing Login Page

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

// Mock useRouter
jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
}));

// Mock supabase
jest.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
  },
}));

test('shows an error message when email is empty', async () => {
  const { getByText, getByPlaceholderText } = render(<LoginPage />);

  const signInButton = getByText('Sign In');
  const passwordInput = getByPlaceholderText('Password');

  // Type in password but leave email input empty
  fireEvent.changeText(passwordInput, 'password123');
  fireEvent.press(signInButton);

  // Wait for the error message to appear
  const errorMessage = await waitFor(() => getByText('Email cannot be empty'));

  expect(errorMessage).toBeTruthy();
});

test('shows an error message when password is empty', async () => {
  const { getByText, getByPlaceholderText } = render(<LoginPage />);

  const signInButton = getByText('Sign In');
  const emailInput = getByPlaceholderText('Email');

  // Type in email but leave password input empty
  fireEvent.changeText(emailInput, 'test@example.com');
  fireEvent.press(signInButton);

  // Wait for the error message to appear
  const errorMessage = await waitFor(() => getByText('Password cannot be empty'));

  expect(errorMessage).toBeTruthy();
});

test('shows an error message when password is incorrect', async () => {
  const { getByText, getByPlaceholderText } = render(<LoginPage />);

  const signInButton = getByText('Sign In');
  const emailInput = getByPlaceholderText('Email');
  const passwordInput = getByPlaceholderText('Password');

  // Mock API response when the password is incorrect
  supabase.auth.signInWithPassword.mockResolvedValue({ 
    error: { message: 'Invalid login credentials' } 
  });

  fireEvent.changeText(emailInput, 'test@example.com');
  fireEvent.changeText(passwordInput, 'incorrect_password');
  fireEvent.press(signInButton);

  // Wait for the error message to appear
  const errorMessage = await waitFor(() => getByText('Invalid login credentials'));

  expect(errorMessage).toBeTruthy();
  expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'incorrect_password',
  });

  // Clear the mock for the next test
  supabase.auth.signInWithPassword.mockClear();
});

test('shows an error message when email is incorrect', async () => {
  const { getByText, getByPlaceholderText } = render(<LoginPage />);

  const signInButton = getByText('Sign In');
  const emailInput = getByPlaceholderText('Email');
  const passwordInput = getByPlaceholderText('Password');

  // Mock API response when the email is incorrect
  supabase.auth.signInWithPassword.mockResolvedValue({ 
    error: { message: 'Invalid login credentials' } 
  });

  fireEvent.changeText(emailInput, 'incorrect_email@example.com');
  fireEvent.changeText(passwordInput, 'password123');
  fireEvent.press(signInButton);

  // Wait for the error message to appear
  const errorMessage = await waitFor(() => getByText('Invalid login credentials'));

  expect(errorMessage).toBeTruthy();
  expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
    email: 'incorrect_email@example.com',
    password: 'password123',
  });

  // Clear the mock for the next test
  supabase.auth.signInWithPassword.mockClear();
});


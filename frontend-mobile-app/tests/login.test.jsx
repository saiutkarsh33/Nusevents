
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useRouter } from "expo-router";
import LoginPage from '../app/(auth)/login';

// Mock useRouter
jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
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


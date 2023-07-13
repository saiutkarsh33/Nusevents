import { RouterProvider, useRouter } from "expo-router";
import { render, fireEvent } from '@testing-library/react-native';
import LoginPage from "../app/(auth)/login";



jest.mock('expo-router', () => ({
  ...jest.requireActual('expo-router'),
  useRouter: () => ({ replace: jest.fn() }),
}));

describe('Login ', () => {
  it('navigates on sign up button press', () => {
    const push = jest.fn();
    const { getByText } = render(
      <RouterProvider>
        <LoginPage />
      </RouterProvider>
    );
    fireEvent.press(getByText('Sign Up'));
    expect(useRouter().replace).toHaveBeenCalledWith('/register');
  });
});

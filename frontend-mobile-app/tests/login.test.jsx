import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';

import LoginPage from "../app/(auth)/login";
//import AuthRoot from "../app/(auth)/__layout";

describe('Login ', () => {
    it('navigates on sign up button press', () => {
      const push = jest.fn();
      const { getByText } = render(<LoginPage navigation={{ push }} />);
      fireEvent.press(getByText('Sign Up'));
      expect(push).toHaveBeenCalledWith('Register');
    });
  });

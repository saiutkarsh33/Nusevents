import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import LoginPage from "../app/(auth)/login";

describe("Login", () => {
  it("displays an error message when submitting with empty email field", () => {
    const { getByLabelText, getByText } = render(<LoginPage />);
    const submitButton = getByText("Submit");

    fireEvent.press(submitButton);

    // Check if the error message is displayed
    expect(getByText("Email cannot be empty")).toBeTruthy();
  });
});

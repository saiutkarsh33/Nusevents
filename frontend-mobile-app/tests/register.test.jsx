import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Register from "../app/(auth)/register.jsx";


describe("Register", () => {
  it("displays an error message when submitting with empty fields", () => {
    const { getByLabelText, getByText } = render(<Register />);
    const submitButton = getByText("Submit");

    fireEvent.press(submitButton);

    // Check if the error message is displayed
    expect(getByText("Please fill in all fields")).toBeTruthy();
  });

  it("submits the form successfully with all fields filled", () => {
    const { getByLabelText, getByText } = render(<Register />);
    const nameInput = getByLabelText("Name");
    const accountTypeInput = getByLabelText("Account Type");
    const residenceInput = getByLabelText("Residence");
    const emailInput = getByLabelText("Email");
    const passwordInput = getByLabelText("Password");
    const submitButton = getByText("Submit");

    // Fill in the input fields
    fireEvent.changeText(nameInput, "John Doe");
    fireEvent.changeText(accountTypeInput, "Personal");
    fireEvent.changeText(residenceInput, "Tembusu");
    fireEvent.changeText(emailInput, "johndoe@example.com");
    fireEvent.changeText(passwordInput, "password");

    fireEvent.press(submitButton);

    // Check if the form is submitted successfully (you can add more assertions here)
    // For example, you can expect that the loading state changes or a success message is displayed
    expect(getByText("Loading...")).toBeTruthy();
  });
});


import { render, fireEvent, waitFor, screen, cleanup } from '@testing-library/react-native';
import CreateEvents, { EventForm } from './files/createEventsTest.jsx';


import { act } from 'react-test-renderer';



afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });


jest.mock('react-native-paper', () => ({
    Text: 'Text',
    TextInput: 'TextInput',
    Button: 'Button',
    ActivityIndicator: 'ActivityIndicator',
  }));
  
  jest.mock('react-native-safe-area-context', () => ({
    SafeAreaView: 'SafeAreaView',
  }));
  
  
  jest.mock('../contexts/auth', () => ({
    useAuth: jest.fn().mockReturnValue({ user: { id: '1234' } }),
  }));
  
  jest.mock('expo-image-picker', () => ({
    launchImageLibraryAsync: jest.fn(),
    MediaTypeOptions: {
      Images: 'Images',
    },
  }));

  


  

  
 

  test('shows an error when the form is submitted with an empty event name', async () => {
    const { getByTestId, findByText } = render(<CreateEvents />);
  
    await waitFor(() => {
      const createButton = getByTestId('createEventButton');
      fireEvent.press(createButton);
    });
  
    const errorMessage = await findByText('Name of event cannot be empty');
    expect(errorMessage).toBeTruthy();
  });

  test('shows an error when the form is submitted with only event name filled', async () => {
    const { getByTestId, findByText } = render(<CreateEvents />);
  
    // Fill in only the event name
    const eventNameInput = getByTestId('eventNameInput');
    fireEvent.changeText(eventNameInput, 'Test Event Name');
  
    const createButton = getByTestId('createEventButton');
    fireEvent.press(createButton);
  
    // Wait for error message to appear
    const errorMessage = await findByText('Venue of event cannot be empty');
    
    expect(errorMessage).toBeTruthy();
  });


  test('renders success message when all fields are filled and create button is pressed', async () => {
    const { getByTestId, findByTestId } = render(<CreateEvents />);
    
    // Fill in all fields
    fireEvent.changeText(getByTestId('eventNameInput'), 'Test Event Name');
    fireEvent.changeText(getByTestId('eventVenueInput'), 'Test Venue');
    fireEvent.changeText(getByTestId('eventDateInput'), '2023-07-25');
    fireEvent.changeText(getByTestId('eventTimeInput'), '13:00');
    fireEvent.changeText(getByTestId('eventDescriptionInput'), 'This is a test event description.');
  
    // Press the create button
    fireEvent.press(getByTestId('createEventButton'));
    
    // Await for success message
    const successMessage = await findByTestId('successMessage');
    
    expect(successMessage).toBeTruthy();
  });


  


 
  





  

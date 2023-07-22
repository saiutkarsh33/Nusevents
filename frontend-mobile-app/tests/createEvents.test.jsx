
import { render, fireEvent, waitFor, screen, cleanup } from '@testing-library/react-native';
import CreateEvents, { EventForm } from '../app/(businessAcc)/createEvents';
import { act } from 'react-test-renderer';


//import { server } from './msw/server.js'

//beforeAll(() => server.listen()) // Start the server at the start of your tests
// afterEach(() => server.resetHandlers()) // Reset any runtime handlers
// afterAll(() => server.close()) // Clean up once the tests are done


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

  const mockInsert = jest.fn(() => Promise.resolve());

let mockSupabase = {
  from: jest.fn().mockImplementation(() => ({ insert: mockInsert })),
  single: jest.fn(),
  storage: {
    from: jest.fn().mockReturnThis(),
    upload: jest.fn(),
    getPublicUrl: jest.fn(),
  },
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
};

jest.mock('../lib/supabase', () => ({
  supabase: mockSupabase,
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


 
  





  

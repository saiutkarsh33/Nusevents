import { View, Button} from "react-native";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/auth";

export default function ProfileScreen() {
  
  const { user } = useAuth();

  const handleChangePassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        console.error('Error resetting password:', error);
        // Handle error
      } else {
        console.log('Password reset email sent successfully');
        // Password reset email sent, inform the user
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      // Handle error
    }
  }

  return (
    <View>
      <Button title="Change Password" onPress={() => handleChangePassword(user.email)} />
      <Button title="Logout" onPress={() => supabase.auth.signOut()} />
    </View>
  );
}
const handleChangePassword = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      console.error("Error resetting password:", error);
      // Handle error
    } else {
      Alert.alert(
        "Password Reset",
        "Password reset email sent. Please check your email.",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    // Handle error
  }
};

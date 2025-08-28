import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="business-info" />
      <Stack.Screen name="address-info" />
      <Stack.Screen name="review" />
      <Stack.Screen name="welcome-complete" />
    </Stack>
  );
}
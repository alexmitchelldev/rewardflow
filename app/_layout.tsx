import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';

function AuthenticatedLayout() {
  const colorScheme = useColorScheme();
  const { user, business, loading, initialized } = useAuth();

  // Handle navigation based on auth state
  useEffect(() => {
    if (!initialized || loading) return;

    // If user is authenticated and has a business profile, go to tabs
    if (user && business) {
      router.replace('/(tabs)');
    }
    // If user is authenticated but no business profile, redirect to onboarding
    else if (user && !business) {
      router.replace('/onboarding/business-info');
    }
    // If not authenticated, ensure we're on a public screen (index or login)
    // We don't redirect here to allow users to navigate between these screens
  }, [user, business, initialized, loading]);

  // Show loading screen while initializing
  if (!initialized || loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>RewardFlow</Text>
        <Text style={styles.loadingSubtext}>Loading...</Text>
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <AuthProvider>
      <AuthenticatedLayout />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
});
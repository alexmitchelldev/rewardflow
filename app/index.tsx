import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { isMockMode } from '../src/db/client';
import { useAuth } from '../src/contexts/AuthContext';

export default function WelcomeScreen() {
  const { user, business, initialized, loading } = useAuth();

  // Redirect authenticated users
  useEffect(() => {
    if (!initialized || loading) return;

    if (user && business) {
      router.replace('/(tabs)');
    } else if (user && !business) {
      router.replace('/onboarding/business-info');
    }
  }, [user, business, initialized, loading]);

  const handleGetStarted = () => {
    router.push('/onboarding/business-info' as any);
  };

  const handleLogin = () => {
    router.push('/login' as any);
  };

  // Don't render welcome screen if user is authenticated
  if (!initialized || loading) {
    return null; // Let the layout handle loading state
  }

  if (user) {
    return null; // Will be redirected by useEffect
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>RewardFlow</Text>
          <Text style={styles.tagline}>Loyalty made simple</Text>
        </View>

        <View style={styles.middle}>
          <Text style={styles.title}>Welcome to RewardFlow</Text>
          <Text style={styles.description}>
            Create and manage customer loyalty programs with ease.
            Build stronger relationships with your customers through
            personalized rewards and seamless experiences.
          </Text>

          {isMockMode && (
            <View style={styles.mockModeNotice}>
              <Text style={styles.mockModeTitle}>🚧 Demo Mode</Text>
              <Text style={styles.mockModeText}>
                Running in demo mode. Your data won&apos;t be saved.
                Check SUPABASE_SETUP.md to enable real authentication.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.bottom}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleGetStarted}
          >
            <Text style={styles.primaryButtonText}>Register Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleLogin}
          >
            <Text style={styles.secondaryButtonText}>I already have an account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  middle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottom: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#4F46E5',
    fontSize: 16,
    fontWeight: '600',
  },
  mockModeNotice: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  mockModeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 8,
  },
  mockModeText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
});

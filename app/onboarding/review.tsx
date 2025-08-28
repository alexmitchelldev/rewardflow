import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { auth, database, getErrorMessage } from '../../src/db/client';
import { Business } from '@/src/contexts/AuthContext';
import { useAlert } from '../../src/hooks';

export default function ReviewScreen() {
  const params = useLocalSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showAlert, AlertComponent } = useAlert();

  // Extract form data from params
  const businessData: Business = {
    name: params.name as string,
    email: params.email as string,
    password: params.password as string,
    phone: params.phone as string || undefined,
    website: params.website as string || undefined,
    description: params.description as string || undefined,
    address_line1: params.address_line1 as string || undefined,
    address_line2: params.address_line2 as string || undefined,
    address_city: params.address_city as string || undefined,
    address_state: params.address_state as string || undefined,
    address_zip_code: params.address_zip_code as string || undefined,
    address_country: params.address_country as string || undefined,
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Step 1: Create Supabase auth user
      console.log('Creating user account...');
      const authResponse = await auth.signUp(businessData.email, businessData.password);

      if (!authResponse.user) {
        throw new Error('Failed to create user account');
      }

      const userId = authResponse.user.id;
      console.log('User created with ID:', userId);

      // Step 2: Create business record in database
      console.log('Creating business record...');
      const businessRecord = {
        id: userId, // Use the auth user ID as the business ID
        name: businessData.name,
        phone: businessData.phone,
        website: businessData.website,
        description: businessData.description,
        address_line1: businessData.address_line1,
        address_line2: businessData.address_line2,
        address_city: businessData.address_city,
        address_state: businessData.address_state,
        address_zip_code: businessData.address_zip_code,
        address_country: businessData.address_country,
        logo_url: null, // Will be added later when image upload is implemented
        is_active: true,
        updated_at: new Date(),
      };

      await database.insertBusiness(businessRecord);
      console.log('Business record created successfully');

      showAlert({
        title: 'Registration Successful!',
        message: 'Your account has been created and your business has been registered. Please check your email to verify your account.',
        buttons: [
          {
            text: 'Continue',
            onPress: () => router.replace('/onboarding/welcome-complete' as any),
          },
        ],
      });
    } catch (error: any) {
      console.error('Registration error:', error);

      const errorMessage = getErrorMessage(error);

      showAlert({
        title: 'Registration Failed',
        message: errorMessage,
        buttons: [{ text: 'OK' }],
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const formatAddress = () => {
    const parts = [
      businessData.address_line1,
      businessData.address_line2,
      businessData.address_city,
      businessData.address_state,
      businessData.address_zip_code,
      businessData.address_country,
    ].filter(Boolean);

    return parts.join(', ') || 'No address provided';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Review Your Information</Text>
          <Text style={styles.subtitle}>Step 3 of 3</Text>
          <Text style={styles.description}>
            Please review your business information before creating your account.
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Information</Text>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Email (Login)</Text>
              <Text style={styles.value}>{businessData.email}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Password</Text>
              <Text style={styles.value}>••••••••</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Business Information</Text>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Business Name</Text>
              <Text style={styles.value}>{businessData.name}</Text>
            </View>

            {businessData.phone && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Phone</Text>
                <Text style={styles.value}>{businessData.phone}</Text>
              </View>
            )}

            {businessData.website && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Website</Text>
                <Text style={styles.value}>{businessData.website}</Text>
              </View>
            )}

            {businessData.description && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Description</Text>
                <Text style={styles.value}>{businessData.description}</Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address</Text>
            <View style={styles.infoRow}>
              <Text style={styles.value}>{formatAddress()}</Text>
            </View>
          </View>

          <View style={styles.notice}>
            <Text style={styles.noticeText}>
              By creating an account, you agree to our Terms of Service and Privacy Policy.
              You will receive an email verification link at {businessData.email}.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#ffffff" size="small" />
              <Text style={styles.loadingText}>Creating Account...</Text>
            </View>
          ) : (
            <Text style={styles.submitButtonText}>Create Account & Register Business</Text>
          )}
        </TouchableOpacity>
      </View>
      <AlertComponent />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  backButton: {
    marginBottom: 24,
  },
  backButtonText: {
    color: '#4F46E5',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  content: {
    paddingHorizontal: 24,
    gap: 24,
  },
  section: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  infoRow: {
    gap: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  value: {
    fontSize: 16,
    color: '#111827',
    lineHeight: 22,
  },
  notice: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  noticeText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

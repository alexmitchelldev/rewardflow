import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import CountryPicker from '../../components/CountryPicker';

export default function AddressInfoScreen() {
  const params = useLocalSearchParams();

  const [formData, setFormData] = useState({
    address_line1: '',
    address_line2: '',
    address_city: '',
    address_state: '',
    address_zip_code: '',
    address_country: 'United Kingdom',
  });

  const handleNext = () => {
    // Combine previous form data with address data
    const combinedData = {
      ...params,
      ...formData,
    };

    router.push({
      pathname: '/onboarding/review' as any,
      params: combinedData,
    });
  };

  const handleBack = () => {
    router.back();
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Business Address</Text>
          <Text style={styles.subtitle}>Step 2 of 3</Text>
          <Text style={styles.description}>
            This information helps customers find your business location.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address Line 1</Text>
            <TextInput
              style={styles.input}
              placeholder="Street address"
              value={formData.address_line1}
              onChangeText={(text) => updateFormData('address_line1', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address Line 2</Text>
            <TextInput
              style={styles.input}
              placeholder="Suite, unit, building, floor, etc."
              value={formData.address_line2}
              onChangeText={(text) => updateFormData('address_line2', text)}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.flex2]}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                placeholder="London"
                value={formData.address_city}
                onChangeText={(text) => updateFormData('address_city', text)}
              />
            </View>

            <View style={[styles.inputGroup, styles.flex1]}>
              <Text style={styles.label}>State</Text>
              <TextInput
                style={styles.input}
                placeholder="Greater London"
                value={formData.address_state}
                onChangeText={(text) => updateFormData('address_state', text)}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.flex1]}>
              <Text style={styles.label}>Post/ZIP Code</Text>
              <TextInput
                style={styles.input}
                placeholder="SW11 7US"
                value={formData.address_zip_code}
                onChangeText={(text) => updateFormData('address_zip_code', text)}
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputGroup, styles.flex2]}>
              <Text style={styles.label}>Country</Text>
              <CountryPicker
                selectedCountry={formData.address_country}
                onCountryChange={(country) => updateFormData('address_country', country)}
                style={styles.input}
                placeholder="Select country"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
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
  form: {
    paddingHorizontal: 24,
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  nextButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

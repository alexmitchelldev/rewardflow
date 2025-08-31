import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AddProductProps, CreateProductData, ProductFormData } from '../../../src/types';

export default function AddProduct({ onBack, onSave }: AddProductProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    rules: '',
    pointsToRedeem: '10',
    maxPoints: '10',
    pointsPerPurchase: '1',
    // rewardValue: '', // Hidden as requested
    // backgroundColor: '#4F46E5', // Hidden as requested
    // textColor: '#FFFFFF', // Hidden as requested
    isActive: true,
    // productTypeId: '', // Commented out as requested
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (loading) return;

    // Basic validation
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Product name is required');
      return;
    }

    if (!formData.description.trim()) {
      Alert.alert('Error', 'Product description is required');
      return;
    }

    // Convert string numbers to integers for numeric fields
    const productData: CreateProductData = {
      name: formData.name,
      description: formData.description,
      rules: formData.rules,
      pointsToRedeem: parseInt(formData.pointsToRedeem) || 10,
      maxPoints: parseInt(formData.maxPoints) || 10,
      pointsPerPurchase: parseInt(formData.pointsPerPurchase) || 1,
      rewardValue: 0, // Default value since field is hidden
      backgroundColor: '#4F46E5', // Default value since field is hidden
      textColor: '#FFFFFF', // Default value since field is hidden
      isActive: formData.isActive,
    };

    try {
      setLoading(true);
      console.log('AddProduct: Attempting to save product:', productData);
      await onSave(productData);
      console.log('AddProduct: Product saved successfully');
    } catch (error) {
      console.error('AddProduct: Error saving product:', error);
      // Error is handled by the parent component
    } finally {
      setLoading(false);
    }
  };



  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add Product</Text>
        <TouchableOpacity
          onPress={handleSave}
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Product Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="e.g., Coffee Loyalty Card"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              placeholder="Describe your loyalty product"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Product Type - Hidden as requested */}
          {/*
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Product Type</Text>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerPlaceholder}>Select product type</Text>
            </View>
          </View>
          */}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Loyalty Rules</Text>

          {/*<View style={styles.inputGroup}>
            <Text style={styles.label}>Rules (JSON format)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.rules}
              onChangeText={(value) => handleInputChange('rules', value)}
              placeholder='{"type": "stamp", "requirement": "purchase"}'
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={2}
            />
          </View>*/}

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Points to Redeem</Text>
              <TextInput
                style={styles.input}
                value={formData.pointsToRedeem}
                onChangeText={(value) => handleInputChange('pointsToRedeem', value)}
                placeholder="10"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Max Points</Text>
              <TextInput
                style={styles.input}
                value={formData.maxPoints}
                onChangeText={(value) => handleInputChange('maxPoints', value)}
                placeholder="10"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Points per Purchase</Text>
            <TextInput
              style={styles.input}
              value={formData.pointsPerPurchase}
              onChangeText={(value) => handleInputChange('pointsPerPurchase', value)}
              placeholder="1"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
          </View>

          {/* Reward Value field hidden as requested */}
          {/*
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Reward Value *</Text>
            <TextInput
              style={styles.input}
              value={formData.rewardValue}
              onChangeText={(value) => handleInputChange('rewardValue', value)}
              placeholder="10.00"
              placeholderTextColor="#9CA3AF"
              keyboardType="decimal-pad"
            />
          </View>
          */}
        </View>

        {/* Appearance section hidden as requested */}
        {/*
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Background Color</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorPicker}>
              {colorOptions.map((color) => (
                <TouchableOpacity
                  key={color.value}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color.value },
                    formData.backgroundColor === color.value && styles.selectedColor
                  ]}
                  onPress={() => handleInputChange('backgroundColor', color.value)}
                >
                  {formData.backgroundColor === color.value && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Text Color</Text>
            <View style={styles.row}>
              <TouchableOpacity
                style={[
                  styles.textColorOption,
                  { backgroundColor: '#FFFFFF' },
                  formData.textColor === '#FFFFFF' && styles.selectedTextColor
                ]}
                onPress={() => handleInputChange('textColor', '#FFFFFF')}
              >
                <Text style={styles.textColorText}>White</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.textColorOption,
                  { backgroundColor: '#000000' },
                  formData.textColor === '#000000' && styles.selectedTextColor
                ]}
                onPress={() => handleInputChange('textColor', '#000000')}
              >
                <Text style={[styles.textColorText, { color: '#FFFFFF' }]}>Black</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <View style={styles.switchRow}>
            <View style={styles.switchContent}>
              <Text style={styles.switchTitle}>Active</Text>
              <Text style={styles.switchDescription}>Product is available to customers</Text>
            </View>
            <Switch
              value={formData.isActive}
              onValueChange={(value) => handleInputChange('isActive', value)}
              trackColor={{ false: '#D1D5DB', true: '#10B981' }}
              thumbColor={formData.isActive ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 18,
    color: '#4F46E5',
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  saveButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
    marginRight: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
  },
  pickerPlaceholder: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  colorPicker: {
    flexDirection: 'row',
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#111827',
  },
  checkmark: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  textColorOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedTextColor: {
    borderColor: '#4F46E5',
  },
  textColorText: {
    fontSize: 16,
    fontWeight: '500',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchContent: {
    flex: 1,
    marginRight: 16,
  },
  switchTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  switchDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  bottomSpacing: {
    height: 40,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
});

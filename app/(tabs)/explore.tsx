import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AddProduct from '../components/products/AddProduct';
import ManageProducts from '../components/products/ManageProducts';
import { useProducts } from '../hooks/useProducts';
import { CreateProductData, UpdateProductData } from '../../src/types';
import { useAlert } from '../../src/hooks/useAlert';

type ViewState = 'main' | 'addProduct' | 'manageProducts';

export default function BusinessManagementScreen() {
  const [currentView, setCurrentView] = useState<ViewState>('main');
  const { products, loading, error, addProduct, updateProduct, deleteProduct } = useProducts();
  const { showAlert, AlertComponent } = useAlert();

  const handleAddProduct = async (productData: CreateProductData) => {
    try {
      console.log('explore.tsx: handleAddProduct called with:', productData);
      await addProduct(productData);
      console.log('explore.tsx: addProduct completed successfully');
      setCurrentView('main');
      showAlert({ title: 'Success', message: 'Product added successfully!' });
    } catch (error) {
      console.error('explore.tsx: Error in handleAddProduct:', error);
      showAlert({ title: 'Error', message: error instanceof Error ? error.message : 'Failed to add product' });
    }
  };

  const handleUpdateProduct = async (productId: number, productData: UpdateProductData) => {
    try {
      await updateProduct(productId, productData);
      showAlert({ title: 'Success', message: 'Product updated successfully!' });
    } catch (error) {
      showAlert({ title: 'Error', message: error instanceof Error ? error.message : 'Failed to update product' });
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      await deleteProduct(productId);
      showAlert({ title: 'Success', message: 'Product deleted successfully!' });
    } catch (error) {
      showAlert({ title: 'Error', message: error instanceof Error ? error.message : 'Failed to delete product' });
    }
  };

  if (currentView === 'addProduct') {
    return (
      <AddProduct
        onBack={() => setCurrentView('main')}
        onSave={handleAddProduct}
      />
    );
  }

  if (currentView === 'manageProducts') {
    return (
      <ManageProducts
        onBack={() => setCurrentView('main')}
        products={products}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        loading={loading}
        error={error}
      />
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Business Management</Text>
          <Text style={styles.subtitle}>Manage your business settings and programs</Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Products</Text>
            {loading && <ActivityIndicator size="small" color="#4F46E5" />}
          </View>
          
          <TouchableOpacity 
            style={[styles.menuItem, loading && styles.menuItemDisabled]}
            onPress={() => setCurrentView('addProduct')}
            disabled={loading}
          >
            <View style={styles.menuIcon}>
              <Text style={styles.menuEmoji}>➕</Text>
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Add Product</Text>
              <Text style={styles.menuDescription}>Create a new loyalty product</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, loading && styles.menuItemDisabled]}
            onPress={() => setCurrentView('manageProducts')}
            disabled={loading}
          >
            <View style={styles.menuIcon}>
              <Text style={styles.menuEmoji}>🛍️</Text>
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Manage Products</Text>
              <Text style={styles.menuDescription}>
                {loading ? 'Loading products...' : `Edit existing products (${products.length})`}
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Hidden sections - uncomment to restore */}
        {/* 
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Information</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Text style={styles.menuEmoji}>🏢</Text>
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Business Profile</Text>
              <Text style={styles.menuDescription}>Update your business details</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Text style={styles.menuEmoji}>📍</Text>
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Location Settings</Text>
              <Text style={styles.menuDescription}>Manage your business address</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Loyalty Programs</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Text style={styles.menuEmoji}>🎯</Text>
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Create Program</Text>
              <Text style={styles.menuDescription}>Set up a new loyalty program</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Text style={styles.menuEmoji}>⚙️</Text>
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Manage Programs</Text>
              <Text style={styles.menuDescription}>Edit existing programs</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Text style={styles.menuEmoji}>📋</Text>
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Program Templates</Text>
              <Text style={styles.menuDescription}>Use pre-built templates</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Management</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Text style={styles.menuEmoji}>👥</Text>
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Customer List</Text>
              <Text style={styles.menuDescription}>View all customers</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Text style={styles.menuEmoji}>📊</Text>
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Customer Insights</Text>
              <Text style={styles.menuDescription}>Analytics and reports</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tools & Settings</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Text style={styles.menuEmoji}>📱</Text>
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>QR Code Scanner</Text>
              <Text style={styles.menuDescription}>Scan customer loyalty cards</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Text style={styles.menuEmoji}>🔗</Text>
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Sign-up Links</Text>
              <Text style={styles.menuDescription}>Generate customer sign-up links</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Text style={styles.menuEmoji}>👨‍💼</Text>
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Staff Management</Text>
              <Text style={styles.menuDescription}>Manage team access</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>
        */}
      </ScrollView>
      <AlertComponent />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  section: {
    backgroundColor: '#ffffff',
    marginTop: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuEmoji: {
    fontSize: 18,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  menuDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  chevron: {
    fontSize: 18,
    color: '#9CA3AF',
    fontWeight: '300',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    marginHorizontal: 24,
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  errorText: {
    color: '#991B1B',
    fontSize: 14,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  menuItemDisabled: {
    opacity: 0.5,
  },
});
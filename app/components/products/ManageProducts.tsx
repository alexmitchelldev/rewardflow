import React, { useState, useEffect } from 'react';
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
  Modal,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

interface Product {
  id: number;
  name: string;
  description: string;
  rules: string;
  pointsToRedeem: number;
  maxPoints: number;
  pointsPerPurchase: number;
  rewardValue: number;
  backgroundColor: string;
  textColor: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ManageProductsProps {
  onBack: () => void;
  products: Product[];
  onUpdateProduct: (productId: number, productData: any) => void;
  onDeleteProduct: (productId: number) => void;
  loading?: boolean;
  error?: string | null;
}

export default function ManageProducts({ onBack, products, onUpdateProduct, onDeleteProduct, loading = false, error }: ManageProductsProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
  };

  const handleSaveEdit = () => {
    if (!editingProduct) return;

    if (!editingProduct.name.trim()) {
      Alert.alert('Error', 'Product name is required');
      return;
    }

    if (!editingProduct.description.trim()) {
      Alert.alert('Error', 'Product description is required');
      return;
    }

    console.log('ManageProducts: Saving product with ID:', editingProduct.id);
    console.log('ManageProducts: Product data being saved:', editingProduct);
    onUpdateProduct(editingProduct.id, editingProduct);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (product: Product) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDeleteProduct(product.id)
        }
      ]
    );
  };

  const handleInputChange = (field: string, value: string | boolean | number) => {
    if (!editingProduct) return;

    setEditingProduct(prev => prev ? ({
      ...prev,
      [field]: value
    }) : null);
  };

  const colorOptions = [
    { name: 'Blue', value: '#4F46E5' },
    { name: 'Green', value: '#059669' },
    { name: 'Purple', value: '#7C3AED' },
    { name: 'Red', value: '#DC2626' },
    { name: 'Orange', value: '#EA580C' },
  ];

  const renderProductCard = (product: Product) => (
    <View key={product.id} style={styles.productCard}>
      <View style={styles.productHeader}>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productDescription}>{product.description}</Text>
          <View style={styles.productStats}>
            <Text style={styles.statText}>Points to Redeem: {product.pointsToRedeem}</Text>
            <Text style={styles.statText}>Max Points: {product.maxPoints}</Text>
            <Text style={styles.statText}>Points/Purchase: {product.pointsPerPurchase}</Text>
            {/* <Text style={styles.statText}>Reward: ${product.rewardValue}</Text> */}
          </View>
        </View>
        {/*<View style={[styles.productPreview, { backgroundColor: product.backgroundColor }]}>
          <Text style={[styles.previewText, { color: product.textColor }]}>Preview</Text>
        </View>*/}
      </View>

      <View style={styles.productActions}>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, product.isActive ? styles.activeBadge : styles.inactiveBadge]}>
            <Text style={[styles.statusText, product.isActive ? styles.activeText : styles.inactiveText]}>
              {product.isActive ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditProduct(product)}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteProduct(product)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Manage Products</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search products..."
          placeholderTextColor="#9CA3AF"
          editable={!loading}
        />
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}

      <ScrollView style={styles.content}>
        {loading && products.length === 0 ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={styles.emptyStateTitle}>Loading Products...</Text>
            <Text style={styles.emptyStateText}>Please wait while we fetch your products.</Text>
          </View>
        ) : filteredProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No Products Found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery ? 'No products match your search.' : 'You haven\'t created any products yet.'}
            </Text>
          </View>
        ) : (
          filteredProducts.map(renderProductCard)
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Edit Product Modal */}
      <Modal
        visible={editingProduct !== null}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setEditingProduct(null)} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Product</Text>
            <TouchableOpacity onPress={handleSaveEdit} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {editingProduct && (
              <>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Basic Information</Text>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Product Name *</Text>
                    <TextInput
                      style={styles.input}
                      value={editingProduct.name}
                      onChangeText={(value) => handleInputChange('name', value)}
                      placeholder="e.g., Coffee Loyalty Card"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Description *</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      value={editingProduct.description}
                      onChangeText={(value) => handleInputChange('description', value)}
                      placeholder="Describe your loyalty product"
                      placeholderTextColor="#9CA3AF"
                      multiline
                      numberOfLines={3}
                    />
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Loyalty Rules</Text>

                  {/*<View style={styles.inputGroup}>
                    <Text style={styles.label}>Rules (JSON format)</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      value={editingProduct.rules}
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
                        value={editingProduct.pointsToRedeem.toString()}
                        onChangeText={(value) => handleInputChange('pointsToRedeem', parseInt(value) || 0)}
                        placeholder="10"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="numeric"
                      />
                    </View>

                    <View style={[styles.inputGroup, styles.halfWidth]}>
                      <Text style={styles.label}>Max Points</Text>
                      <TextInput
                        style={styles.input}
                        value={editingProduct.maxPoints.toString()}
                        onChangeText={(value) => handleInputChange('maxPoints', parseInt(value) || 0)}
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
                      value={editingProduct.pointsPerPurchase.toString()}
                      onChangeText={(value) => handleInputChange('pointsPerPurchase', parseInt(value) || 0)}
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
                      value={editingProduct.rewardValue.toString()}
                      onChangeText={(value) => handleInputChange('rewardValue', parseFloat(value) || 0)}
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
                            editingProduct.backgroundColor === color.value && styles.selectedColor
                          ]}
                          onPress={() => handleInputChange('backgroundColor', color.value)}
                        >
                          {editingProduct.backgroundColor === color.value && (
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
                          editingProduct.textColor === '#FFFFFF' && styles.selectedTextColor
                        ]}
                        onPress={() => handleInputChange('textColor', '#FFFFFF')}
                      >
                        <Text style={styles.textColorText}>White</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.textColorOption,
                          { backgroundColor: '#000000' },
                          editingProduct.textColor === '#000000' && styles.selectedTextColor
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
                      value={editingProduct.isActive}
                      onValueChange={(value) => handleInputChange('isActive', value)}
                      trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                      thumbColor={editingProduct.isActive ? '#FFFFFF' : '#FFFFFF'}
                    />
                  </View>
                </View>

                <View style={styles.bottomSpacing} />
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  placeholder: {
    width: 60,
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  productInfo: {
    flex: 1,
    marginRight: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  productStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginRight: 12,
    marginBottom: 2,
  },
  // productPreview: {
  //   width: 60,
  //   height: 40,
  //   borderRadius: 6,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  // previewText: {
  //   fontSize: 10,
  //   fontWeight: '500',
  // },
  productActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusContainer: {
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  activeBadge: {
    backgroundColor: '#D1FAE5',
  },
  inactiveBadge: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  activeText: {
    color: '#065F46',
  },
  inactiveText: {
    color: '#991B1B',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 40,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cancelButton: {
    paddingVertical: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6B7280',
  },
  modalTitle: {
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
  modalContent: {
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
  errorContainer: {
    backgroundColor: '#FEE2E2',
    marginHorizontal: 24,
    marginBottom: 16,
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
});

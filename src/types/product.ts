// Product types based on the database schema
export interface Product {
  id: number;
  businessId: string;
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

// Type for creating a new product (excludes auto-generated fields)
export type CreateProductData = Omit<Product, "id" | "businessId" | "createdAt" | "updatedAt">;

// Type for updating a product (all fields optional except id)
export type UpdateProductData = Partial<Omit<Product, "id" | "businessId">>;

// Type for product data from forms (string values that need conversion)
export interface ProductFormData {
  name: string;
  description: string;
  rules: string;
  pointsToRedeem: string;
  maxPoints: string;
  pointsPerPurchase: string;
  rewardValue?: string;
  backgroundColor?: string;
  textColor?: string;
  isActive: boolean;
}

// Hook return type
export interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
  addProduct: (productData: CreateProductData) => Promise<void>;
  updateProduct: (productId: number, updateData: UpdateProductData) => Promise<void>;
  deleteProduct: (productId: number) => Promise<void>;
}

// Component prop types
export interface AddProductProps {
  onBack: () => void;
  onSave: (productData: CreateProductData) => Promise<void>;
}

export interface ManageProductsProps {
  onBack: () => void;
  products: Product[];
  onUpdateProduct: (productId: number, productData: UpdateProductData) => void;
  onDeleteProduct: (productId: number) => void;
  loading?: boolean;
  error?: string | null;
}

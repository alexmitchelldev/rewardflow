import { useState, useEffect, useCallback } from "react";
import { database, auth } from "../../src/db/client";
import { Product, UseProductsReturn, CreateProductData, UpdateProductData } from "../../src/types";

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCurrentBusinessId = async (): Promise<string | null> => {
    try {
      const user = await auth.getCurrentUser();
      return user?.id || null;
    } catch (err) {
      console.error("Error getting current user:", err);
      return null;
    }
  };

  const refreshProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const businessId = await getCurrentBusinessId();
      if (!businessId) {
        setProducts([]);
        return;
      }

      const fetchedProducts = await database.getProductsByBusinessId(businessId);
      setProducts(fetchedProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = async (productData: CreateProductData) => {
    try {
      console.log("useProducts: Starting addProduct with data:", productData);
      const businessId = await getCurrentBusinessId();
      console.log("useProducts: Got businessId:", businessId);

      if (!businessId) {
        throw new Error("No business ID found");
      }

      const newProductData = {
        ...productData,
        businessId,
      };

      console.log("useProducts: Calling database.insertProduct with:", newProductData);
      const newProduct = await database.insertProduct(newProductData);
      console.log("useProducts: Database returned:", newProduct);

      setProducts((prev) => [newProduct, ...prev]);
      console.log("useProducts: Product added successfully");
    } catch (err) {
      console.error("useProducts: Error adding product:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to add product";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateProduct = async (productId: number, updateData: UpdateProductData) => {
    try {
      const updatedProduct = await database.updateProduct(productId, updateData);
      setProducts((prev) =>
        prev.map((product) => {
          if (product.id === productId) {
            // Ensure we have a complete product object by merging properly
            return {
              ...product,
              ...updatedProduct,
              // Ensure we keep the ID and update timestamp
              id: productId,
              updatedAt: updatedProduct.updatedAt || new Date().toISOString(),
            };
          }
          return product;
        }),
      );
    } catch (err) {
      console.error("Error updating product:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to update product";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteProduct = async (productId: number) => {
    try {
      await database.deleteProduct(productId);
      setProducts((prev) => prev.filter((product) => product.id !== productId));
    } catch (err) {
      console.error("Error deleting product:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to delete product";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  return {
    products,
    loading,
    error,
    refreshProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};

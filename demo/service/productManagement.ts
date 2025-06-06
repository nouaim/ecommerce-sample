import { Product, getProducts, updateProduct, deleteProduct, createProduct } from "./api";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { canPerformAction } from "./auth";

// In-memory product cache to simulate database
let productsCache: Product[] = [];
let toastRef: React.RefObject<Toast> | null = null;

// Initialize toast reference
export const initializeToast = (ref: React.RefObject<Toast>) => {
  toastRef = ref;
};

// Helper function to show toast
const showToast = (severity: 'success' | 'error' | 'warn' | 'info', summary: string, detail: string) => {
  toastRef?.current?.show({ severity, summary, detail, life: 3000 });
};

// Load initial products
const initializeProducts = async () => {
  if (productsCache.length === 0) {
    try {
      productsCache = await getProducts();
    } catch (error) {
      console.error("Failed to initialize products:", error);
      showToast('error', 'Initialization Error', 'Failed to load products');
    }
  }
};

// Initialize once
initializeProducts();

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  if (productsCache.length === 0) {
    await initializeProducts();
  }
  return [...productsCache]; // Return a copy to prevent direct modification
};

// Get product by ID
export const getProductById = async (id: number): Promise<Product | undefined> => {
  if (productsCache.length === 0) {
    await initializeProducts();
  }
  return productsCache.find(product => product.id === id);
};

// Update existing product
export const update = async (id: number, updates: Partial<Product>): Promise<Product | null> => {
    if (!canPerformAction("update")) {
        showToast('error', 'Permission Denied', "You don't have permission to update products");
        return null;
    }
 
  return updateProduct(id, updates);
};

// Delete product
export const deleteP = async (id: number): Promise<boolean> => {
  if (!canPerformAction("delete")) {
    console.warn('wa are here');
    showToast('error', 'Permission Denied', "You don't have permission to delete products");
    return false;
  }

  await deleteProduct(id);
  return true;
};

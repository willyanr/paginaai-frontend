import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { productService } from "@/services/products";
import { DataProduct } from "@/interfaces/products.interface";
import { useApi } from "@/services/api";

interface ProductContextProps {
  products: DataProduct[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
  createProduct: (product: FormData) => Promise<DataProduct>;
  deleteProducts: (id: number) => void;
  updateProducts: (product: FormData, id: number) => Promise<void>;

};


const ProductContext = createContext<ProductContextProps>({
  products: [],
  loading: false,
  error: null,
  refresh: () => { },
  createProduct: async () => {
    return {} as DataProduct;
  },
  updateProducts: async () => {
    return;
  },
  deleteProducts: () => { },
});

export const useProductsContext = () => useContext(ProductContext);

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<DataProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const api = useApi();
  
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getAll(api);
      setProducts(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error: ${error.message}`);
      } else {
        throw new Error('An unknown error occurred while updating the project.');
      }
    } finally {
      setLoading(false);
    }
  }, [api]);


  const createProduct = useCallback(async (product: FormData) => {
    setLoading(true);

    setError(null);
    try {
      const newProduct = await productService.create(api, product);
      setProducts((prev) => [...prev, newProduct]);
      return newProduct;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error('An unknown error occurred while updating the project.');
      }
    } finally {
      setLoading(false);
    }
  }, [api]);

  const deleteProducts = async (id: number) => {
    setLoading(true);
    try {
      await productService.delete(api, id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error: ${error.message}`);
      } else {
        throw new Error('An unknown error occurred while updating the project.');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProducts = async (product: FormData, id: number) => {
    setLoading(true);
    try {
      await productService.update(api, product, id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error: ${error.message}`);
      } else {
        throw new Error('An unknown error occurred while updating the project.');
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <ProductContext.Provider value={{ products, loading, error, refresh: fetchProducts, createProduct, deleteProducts, updateProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

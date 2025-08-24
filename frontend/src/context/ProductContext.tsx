import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { productService } from "@/services/products";
import { DataProduct } from "@/interfaces/products.interface";

interface ProductContextProps {
  products: DataProduct[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
  createProduct: (product: DataProduct) => Promise<DataProduct>;
  deleteProducts: (id:number) => void;
  updateProducts: (product: DataProduct, id: number) => Promise<void>;

};


const ProductContext = createContext<ProductContextProps>({
  products: [],
  loading: false,
  error: null,
  refresh: () => {},
  createProduct: async (product: DataProduct) => {
    return {} as DataProduct;
  },
  deleteProducts: (id:number) => {},
  updateProducts: async (product: DataProduct, id: number) => {
    return;
  },
});

export const useProductsContext = () => useContext(ProductContext);

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<DataProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('to sendo chamado', +1)
      const data = await productService.getAll();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || "Erro ao buscar produtos");
    } finally {
      setLoading(false);
    }
  }, []);


  const createProduct = useCallback(async (product: DataProduct) => {
    setLoading(true);
    console.log('fuichaado')
    setError(null);
    try {
      const newProduct = await productService.create(product);
      console.log('fuichaado')
      setProducts((prev) => [...prev, newProduct]); 
      return newProduct; 
    } catch (err: any) {
      setError(err.message || "Erro ao criar produto");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProducts = async (id: number) => {
    setLoading(true);
    try {
      await productService.delete(id);
    } catch (err: any) {
      setError(err.message || "Erro ao deletar produtos");
    } finally {
      setLoading(false);
    }
  };

  const updateProducts = async (product: DataProduct | FormData, id: number) => {
    setLoading(true);
    try {
      await productService.update(product, id);
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar produtos");
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

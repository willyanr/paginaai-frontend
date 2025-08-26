import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { checkoutService } from "@/services/checkout";
import { DataCheckout, DataWalletWithTransactions } from "@/interfaces/checkout.interface";

interface CheckoutContextProps {
  checkout: DataCheckout[];
  error: string | null;
  wallet: DataWalletWithTransactions[];
  refresh: () => void;
  updateCustomCheckout: (customCheckout: FormData, id: number) => Promise<void>;
  refreshWallet: () => void;
}

const CheckoutContext = createContext<CheckoutContextProps>({
  checkout: [],
  wallet: [],
  error: null,
  refresh: () => {},
  updateCustomCheckout: async () => {
    return;
  },
  refreshWallet: () => {},
});


export const useCheckoutContext = () => useContext(CheckoutContext);

interface CheckoutProviderProps {
  children: ReactNode;
}

export const CheckoutProvider: React.FC<CheckoutProviderProps> = ({ children }) => {
  const [checkout, setCheckout ] = useState<DataCheckout[]>([]);
  const [ wallet , setWallet ] = useState<DataWalletWithTransactions[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchCheckout = useCallback(async () => {
    setError(null);
    try {
      const data = await checkoutService.getAll();
      setCheckout(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error: ${error.message}`);
      } else {
        throw new Error('An unknown error occurred while fetchCheckout.');
      }
    } finally {
    }
  }, []);

  const fetchWallet = useCallback(async () => {
    try {
      const data = await checkoutService.getWallet();
      setWallet(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error: ${error.message}`);
      } else {
        throw new Error('An unknown error occurred while fetchCheckout.');
      }
    } finally {
    }
  }, []);


  // const createProduct = useCallback(async (product: DataProduct) => {
  //   setLoading(true);
  //   console.log('fuichaado')
  //   setError(null);
  //   try {
  //     const newProduct = await productService.create(product);
  //     console.log('fuichaado')
  //     setProducts((prev) => [...prev, newProduct]); 
  //     return newProduct; 
  //   } catch (err: any) {
  //     setError(err.message || "Erro ao criar produto");
  //     throw err;
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  // const deleteProducts = async (id: number) => {
  //   setLoading(true);
  //   try {
  //     await productService.delete(id);
  //   } catch (err: any) {
  //     setError(err.message || "Erro ao deletar produtos");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

 const updateCustomCheckout = async (customCheckout: FormData, id: number) => {
    try {
      await checkoutService.update(customCheckout, id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error: ${error.message}`);
      } else {
        throw new Error('An unknown error occurred while updateCustomCheckout.');
      }
    } finally {
    }
  };


  return (
    <CheckoutContext.Provider value={{ checkout, wallet, error, refresh: fetchCheckout, updateCustomCheckout, refreshWallet: fetchWallet  }}>
      {children}
    </CheckoutContext.Provider>
  );
};

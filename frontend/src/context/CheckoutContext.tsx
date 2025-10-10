import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { checkoutService } from "@/services/checkout";
import { DataCheckout, DataRequestWithdraw, DataWalletWithTransactions, VerifyPaymentResponse } from "@/interfaces/checkout.interface";
import { useApi } from "@/services/api";

interface CheckoutContextProps {
  checkout: DataCheckout[];
  error: string | null;
  wallet: DataWalletWithTransactions[];
  refresh: () => void;
  updateCustomCheckout: (customCheckout: FormData, id: number) => Promise<void>;
  refreshWallet: () => void;
  requestWithdraw: (payload: DataRequestWithdraw) => void;
  verifyPayment: (id: string) => Promise<VerifyPaymentResponse>;
}

const CheckoutContext = createContext<CheckoutContextProps>({
  checkout: [],
  wallet: [],
  error: null,
  refresh: () => { },
  updateCustomCheckout: async () => {
    return;
  },
  refreshWallet: () => { },
  requestWithdraw: () => { },
  verifyPayment: async () => {
    return {} as VerifyPaymentResponse;
},

});


export const useCheckoutContext = () => useContext(CheckoutContext);

interface CheckoutProviderProps {
  children: ReactNode;
}

export const CheckoutProvider: React.FC<CheckoutProviderProps> = ({ children }) => {
  const [checkout, setCheckout] = useState<DataCheckout[]>([]);
  const [wallet, setWallet] = useState<DataWalletWithTransactions[]>([]);
  const [error, setError] = useState<string | null>(null);

  const api = useApi();

  const fetchCheckout = useCallback(async () => {
    setError(null);
    try {
      const data = await checkoutService.getAll(api);
      setCheckout(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error: ${error.message}`);
      } else {
        throw new Error('An unknown error occurred while fetchCheckout.');
      }
    } finally {
    }
  }, [api]);

  const fetchWallet = useCallback(async () => {
    try {
      const data = await checkoutService.getWallet(api);
      setWallet(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error: ${error.message}`);
      } else {
        throw new Error('An unknown error occurred while fetchCheckout.');
      }
    } finally {
    }
  }, [api]);


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
      await checkoutService.update(api, customCheckout, id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error: ${error.message}`);
      } else {
        throw new Error('An unknown error occurred while updateCustomCheckout.');
      }
    } finally {
    }
  };



  const verifyPayment = async (id:string) => {
    try {
      const data = await checkoutService.getVerifyPayment(api, id);
      return data
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error('An unknown error occurred while getVerifyPayment .');
      }
    } finally {
    }
  };


  const requestWithdraw = async (payload: DataRequestWithdraw) => {
    try {
      await checkoutService.requestWithdraw(api, payload)
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error('Erro ao solicitar saque');
      }
    } finally {
    }
  };


  return (
    <CheckoutContext.Provider value={{
      checkout, wallet, error,
      requestWithdraw,
      refresh: fetchCheckout, updateCustomCheckout, refreshWallet: fetchWallet, verifyPayment
    }}>
      {children}
    </CheckoutContext.Provider>
  );
};

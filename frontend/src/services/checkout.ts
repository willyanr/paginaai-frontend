import { DataCheckout, DataRequestWithdraw, DataWalletWithTransactions, VerifyPaymentResponse } from '@/interfaces/checkout.interface';
import api from './api';


export const checkoutService = {
  async getAll(): Promise<DataCheckout[]> {
    const res = await api.get("/checkout/custom-checkout/");
    if (!res || !res.data) throw new Error("Erro ao buscar produtos");
    return res.data as DataCheckout[];
  },


  async getWallet(): Promise<DataWalletWithTransactions[]> {
    const res = await api.get("/checkout/wallet/");
    if (!res || !res.data) throw new Error("Erro ao buscar Carteira");
    return res.data as DataWalletWithTransactions[];
  },

  async getVerifyPayment(id:string): Promise<VerifyPaymentResponse> {
    const res = await api.get(`/checkout/verify-sub/${id}/`);
    if (!res || !res.data) throw new Error("Erro ao verificar pagamento.");
    return res.data as VerifyPaymentResponse;
  },

  async requstWithdraw(payload: DataRequestWithdraw): Promise<void> {
    try {
      const res = await api.post("/checkout/request-pix-out/", payload);
      return res.data;
    } catch (error: unknown) {
      let errorMessage = 'Erro desconhecido ao solicitar saque.';

      if (typeof error === 'object' && error !== null && 'response' in error) {
        const err = error as {

          response?: { data?: Record<string, string> };
        };

        const data = err.response?.data;

        if (data) {
          errorMessage =
            data.detail ||
            data.message ||
            data.error ||
            (Object.values(data)[0]?.[0] as string) ||
            errorMessage;
        }
      }

      throw new Error(errorMessage);
    }


  },

  // async create(product: DataProduct | FormData): Promise<DataProduct> {
  //   const res = await api.post("/checkout/products/", product, {
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //     },
  //   });

  //   if (!res || !res.data) {
  //     throw new Error("Erro ao criar produto");
  //   }

  //   return res.data as DataProduct;
  // },
  // async delete(id: number): Promise<void> {
  //   const res = await api.delete(`/checkout/products/${id}/`);
  //   if (!res || !res.data) throw new Error("Erro ao deletar produto");
  //   return res.data;
  // },
  async update(customCheckout: DataCheckout | FormData, id: number): Promise<void> {
    const res = await api.patch(`/checkout/custom-checkout/${id}/`, customCheckout, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!res || !res.data) {
      throw new Error("Erro ao criar atualizar produto");
    }

    return;
  },

};

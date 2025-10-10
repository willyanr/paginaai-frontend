import { DataProduct } from "@/interfaces/products.interface";
import { AxiosInstance } from "axios";



export const productService = {
  async getAll(api: AxiosInstance): Promise<DataProduct[]> {
    const res = await api.get("/checkout/products/");
    if (!res || !res.data) throw new Error("Erro ao buscar produtos");
    return res.data as DataProduct[];
  },


  async create(api: AxiosInstance, product: DataProduct | FormData): Promise<DataProduct> {

    try {
      const res = await api.post("/checkout/products/", product, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data as DataProduct;
    } catch (error: unknown) {
      let errorMessage = 'Erro desconhecido ao criar domínio.';
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const err = error as { response?: { data?: { detail?: string; message?: string } } };
        errorMessage =
          err.response?.data?.detail ||
          err.response?.data?.message ||
          errorMessage;
      }
      throw new Error(errorMessage);
    }

  },


  async delete(api: AxiosInstance, id: number): Promise<void> {
    const res = await api.delete(`/checkout/products/${id}/`);

    if (!res || (res.status !== 200 && res.status !== 204)) {
      throw new Error("Erro ao deletar produto");
    }

    return;
  },
  async update(api: AxiosInstance, product: DataProduct | FormData, id: number): Promise<DataProduct> {
    const res = await api.put(`/checkout/products/${id}/`, product, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!res || !res.data) {
      throw new Error("Erro ao criar atualizar produto");
    }

    return res.data as DataProduct;
  },

};

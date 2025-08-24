import { DataProduct } from "@/interfaces/products.interface";
import api from './api';


export const productService = {
  async getAll(): Promise<DataProduct[]> {
    const res = await api.get("/checkout/products/");
    if (!res || !res.data) throw new Error("Erro ao buscar produtos");
    return res.data as DataProduct[];
  },
  async create(product: DataProduct | FormData): Promise<DataProduct> {
    const res = await api.post("/checkout/products/", product, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!res || !res.data) {
      throw new Error("Erro ao criar produto");
    }

    return res.data as DataProduct;
  },
  async delete(id: number): Promise<void> {
    const res = await api.delete(`/checkout/products/${id}/`);
    if (!res || !res.data) throw new Error("Erro ao deletar produto");
    return res.data;
  },
  async update(product: DataProduct | FormData, id: number): Promise<DataProduct> {
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

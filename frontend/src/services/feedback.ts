import { AxiosInstance } from "axios";




export const feedbackService = {
  async create(api: AxiosInstance, text: string ): Promise<void> {
    const payload = {
      feedback_text: text
    }
    const res = await api.post("/feedback/", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!res || !res.data) {
      throw new Error("Erro ao criar produto");
    }

    return res.data;
  },

};

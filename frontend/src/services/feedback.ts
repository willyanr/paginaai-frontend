import api from './api';


export const feedbackService = {

  async create(text: string ): Promise<void> {
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

import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { InfoCard } from "@/components/ui/info/InfoCard";
import { Modal } from "@/components/ui/modal";
import { useAlertContext } from "@/context/AlertContext";
import { useModalContext } from "@/context/ModalContext";
import { feedbackService } from "@/services/feedback";
import React, { useState } from "react";

export default function SidebarWidget() {
  const { onAlert } = useAlertContext();
  const { isOpen, openModal, closeModal } = useModalContext();

  const [feedback, setFeedback] = useState("");

  const handleFeedbackSubmit = async () => {
    if (!feedback.trim()) {
      onAlert(true, "error", "Por favor, escreva seu feedback antes de enviar.");
      return;
    }

    try {
      await feedbackService.create(feedback);
      onAlert(true, "success", "Obrigado pelo seu feedback! 🧡");
      setFeedback(""); 
      closeModal();
    } catch (error) {
      onAlert(true, "error", "Erro ao enviar feedback.");
    }
  };

  return (
    <div>
      <aside
        className="mx-auto mb-10 w-full max-w-xs border border-brand-500 rounded-2xl bg-gray-50 px-6 py-6 text-center shadow-sm dark:bg-white/[0.03]"
        aria-labelledby="sidebar-feedback-title"
      >
        <h3
          id="sidebar-feedback-title"
          className="mb-2 text-lg font-semibold text-gray-900 dark:text-white"
        >
          Nos ajude com seu feedback
        </h3>

        <p className="mb-5 text-sm text-gray-600 dark:text-gray-400">
          Sua opinião é muito importante para melhorarmos sua experiência.
        </p>

        <button
          onClick={() => openModal("feedback")}
          className="inline-flex w-full items-center justify-center rounded-xl bg-brand-500 px-4 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          Realizar feedback
        </button>
      </aside>

      <Modal isOpen={isOpen("feedback")} onClose={closeModal}>
        <div className="mt-2 py-10">
          <Label htmlFor="feedback">Seu feedback 🧡</Label>
          <InfoCard size="xs">Como podemos melhorar?</InfoCard>

          <textarea
            id="feedback"
            placeholder="Escreva seu feedback aqui..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full h-32 p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-400 text-base"
          />

          <div className="flex justify-center">
            <Button
              size="sm"
              variant="primary"
              className="mt-4"
              onClick={handleFeedbackSubmit}
            >
              Enviar feedback
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

"use client";

import { createContext, useContext } from "react";
import { useModal } from "../hooks/useModal";
import { ModalContextType } from "@/interfaces/modal.interface";

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }) => {
  const modal = useModal(); 

  return (
    <ModalContext.Provider value={modal}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModalContext must be used within a ModalProvider");
  }
  return context;
};

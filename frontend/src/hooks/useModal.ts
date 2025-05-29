"use client";
import { useState, useCallback } from "react";

export const useModal = (initialState: boolean = false) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const openModal = useCallback((id: string) => setOpenId(id), []);
  const closeModal = useCallback(() => setOpenId(null), []);
  const isOpen = useCallback((id: string) => openId === id, [openId]);

  return { openModal, closeModal, isOpen, openId };
};

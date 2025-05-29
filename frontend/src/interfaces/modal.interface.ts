export interface ModalContextType {
  openModal: (id: string) => void;
  closeModal: () => void;
  isOpen: (id: string) => boolean;
  openId: string | null;
}
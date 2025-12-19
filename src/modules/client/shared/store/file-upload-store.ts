import { TGetFileUploadRequiredDataControllerOutput } from "@/modules/server/filenest/interface-adapters/controllers/fileUpload";
import { ZSAError } from "zsa";
import { create } from "zustand";

export type ModalType = "fileUpload";

interface AdminStoreModal {
  type: ModalType | null;
  isOpen: boolean;
  trigger: number;
  triggerInModal: number;
  title?: string | null;
  description?: string | null;
  error?: ZSAError | null;
  fileUploadData?: TGetFileUploadRequiredDataControllerOutput | null;
  incrementTrigger: () => void;
  incrementInModalTrigger: () => void;
  onOpen: (props: {
    type: ModalType;
    title?: string;
    description?: string;
    error?: ZSAError | null;
    fileUploadData?: TGetFileUploadRequiredDataControllerOutput | null;
  }) => void;
  onClose: () => void;
}

const _useFileUploadStore = create<AdminStoreModal>((set) => ({
  type: null,
  isOpen: false,
  trigger: 0,
  triggerInModal: 0,
  onOpen: ({
    type,
    title = null,
    description = null,
    error = null,
    fileUploadData = null,
  }) =>
    set({
      isOpen: true,
      type,
      title,
      description,
      error,
      fileUploadData,
    }),
  onClose: () =>
    set({
      type: null,
      isOpen: false,
      title: null,
      description: null,
      error: null,
      fileUploadData: null,
      trigger: 0,
      triggerInModal: 0,
    }),
  incrementTrigger: () => set((state) => ({ trigger: state.trigger + 1 })),
  incrementInModalTrigger: () =>
    set((state) => ({ triggerInModal: state.triggerInModal + 1 })),
}));

export const useFileUploadStore = _useFileUploadStore;
export const fileUploadStore = _useFileUploadStore;

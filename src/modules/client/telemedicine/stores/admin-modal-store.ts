import { create } from "zustand";

export type ModalType = "deleteDoctorProfile" | "addDoctorByHPR";

interface AdminStore {
  type: ModalType | null;
  isOpen: boolean;
  doctorProfileId?: string;
  trigger: number;
  triggerInModal: number;
  incrementTrigger: () => void;
  incrementInModalTrigger: () => void;
  onOpen: (props: { type: ModalType; doctorProfileId?: string }) => void;
  onClose: () => void;
}

const _useAdminModalStore = create<AdminStore>((set) => ({
  type: null,
  isOpen: false,
  trigger: 0,
  triggerInModal: 0,
  onOpen: ({ type, doctorProfileId = "" }) =>
    set({
      isOpen: true,
      type,
      doctorProfileId,
    }),
  onClose: () =>
    set({
      type: null,
      isOpen: false,
      trigger: 0,
      triggerInModal: 0,
      doctorProfileId: "",
    }),
  incrementTrigger: () => set((state) => ({ trigger: state.trigger + 1 })),
  incrementInModalTrigger: () =>
    set((state) => ({ triggerInModal: state.triggerInModal + 1 })),
}));

export const useAdminModalStore = _useAdminModalStore;
export const adminModalStore = _useAdminModalStore;

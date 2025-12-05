import { TAppointment } from "@/modules/shared/entities/models/telemedicine/appointment";
import { create } from "zustand";

export type ModalType =
  | "doctorReview"
  | "confirmedAppointmentMessage"
  | "bookAppointment"
  | "rescheduleAppointment"
  | "cancelAppointment"
  | "viewAppointment"
  | "deleteAppointment";

interface PatientStore {
  type: ModalType | null;
  isOpen: boolean;
  doctorProfileId?: string;
  doctorData?: any;
  appointmentData?: TAppointment | null;
  trigger: number;
  triggerInModal: number;
  incrementTrigger: () => void;
  incrementInModalTrigger: () => void;
  onOpen: (props: {
    type: ModalType;
    doctorProfileId?: string;
    doctorData?: any;
    appointmentData?: TAppointment;
  }) => void;
  onClose: () => void;
}

const _usePatientModalStore = create<PatientStore>((set) => ({
  type: null,
  isOpen: false,
  trigger: 0,
  triggerInModal: 0,
  onOpen: ({
    type,
    doctorProfileId = "",
    doctorData = null,
    appointmentData = null,
  }) =>
    set({
      isOpen: true,
      type,
      doctorProfileId,
      doctorData,
      appointmentData,
    }),
  onClose: () =>
    set({
      type: null,
      isOpen: false,
      trigger: 0,
      triggerInModal: 0,
      doctorProfileId: "",
      doctorData: null,
      appointmentData: null,
    }),
  incrementTrigger: () => set((state) => ({ trigger: state.trigger + 1 })),
  incrementInModalTrigger: () =>
    set((state) => ({ triggerInModal: state.triggerInModal + 1 })),
}));

export const usePatientModalStore = _usePatientModalStore;
export const PatientModalStore = _usePatientModalStore;

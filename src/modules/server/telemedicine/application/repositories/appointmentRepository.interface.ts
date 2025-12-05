import {
  TAppointment,
  TAppointments,
  TBookAppointment,
  TCancelAppointment,
  TGetAppointmentByIds,
  TRescheduleAppointment,
} from "../../../../shared/entities/models/telemedicine/appointment";

export interface IAppointmentRepository {
  getAppointmentsForPatient(
    patientId: string,
    orgId: string
  ): Promise<TAppointments>;
  getAppointmentsForDoctor(
    doctorId: string,
    orgId: string
  ): Promise<TAppointments>;
  getAppointmentForOnlineConsultation(
    appointmentId: string,
    orgId: string
  ): Promise<TAppointment | null>;
  bookAppointment(appointmentData: TBookAppointment): Promise<TAppointment>;
  rescheduleAppointment(
    rescheduleData: TRescheduleAppointment,
    status: "RESCHEDULED" | "PENDING"
  ): Promise<TAppointment>;
  getAppointmentByIds(
    appointmentId: string,
    orgId: string
  ): Promise<TGetAppointmentByIds | null>;
  confirmAppointment(
    appointmentId: string,
    userId: string,
    orgId: string
  ): Promise<TAppointment>;
  cancelAppointment(cancelData: TCancelAppointment): Promise<TAppointment>;
  deleteAppointment(
    appointmentId: string,
    orgId: string,
    userId: string,
    actorType: "PATIENT" | "DOCTOR"
  ): Promise<string>;
}

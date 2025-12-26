import {
  TAppointments,
  TGetDashboardDataPayload,
} from "../../../../shared/entities/models/telemedicine/dashboard";

export interface IDashboardRepository {
  getDashboardAppointmentsData(
    payload: TGetDashboardDataPayload
  ): Promise<TAppointments>;
}

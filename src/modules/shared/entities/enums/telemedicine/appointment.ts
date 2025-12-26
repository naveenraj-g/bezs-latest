import z from "zod";

export const AppointmentStatus = [
  "PENDING",
  "SCHEDULED",
  "RESCHEDULED",
  "CANCELLED",
  "COMPLETED",
] as const;
export type TAppointmentStatus = (typeof AppointmentStatus)[number];

export const ZodEAppointmentStatus = z.enum(AppointmentStatus);

import { IAppointmentRepository } from "../application/repositories/appointmentRepository.interface";
import { IDoctorProfileRepository } from "../application/repositories/doctorProfileRepository.interface";
import { IDoctorRepository } from "../application/repositories/doctorRepository.interface";
import { IDoctorServiceRepository } from "../application/repositories/doctorServiceRepository.interface";
import { IDoctorWeeklyAvailabilityRepository } from "../application/repositories/doctorWeeklyAvailabilityRepository.interface";
import { IIdResolverRepository } from "../application/repositories/idResolverRepository.interface";
import { IOrgAccessCheckRepository } from "../application/repositories/orgAccessCheckRepository.interface";
import { IPatientProfileRepository } from "../application/repositories/patientProfileRepository.interface";
import { IABDMService } from "../application/services/abdmService.interface";

export const DI_SYMBOLS = {
  // Repositories
  IDoctorProfileRepository: Symbol.for("IDoctorProfileRepository"),
  IPatientProfileRepository: Symbol.for("IPatientProfileRepository"),
  IAppointmentRepository: Symbol.for("IAppointmentRepository"),
  IDoctorServiceRepository: Symbol.for("IDoctorServiceRepository"),
  IOrgAccessCheckRepository: Symbol.for("IOrgAccessCheckRepository"),
  IIdResolverRepository: Symbol.for("IIdResolverRepository"),
  IDoctorWeeklyAvailabilityRepository: Symbol.for(
    "IDoctorWeeklyAvailabilityRepository"
  ),
  IDoctorRepository: Symbol.for("IDoctorRepository"),

  // Services
  IABDMService: Symbol.for("IABDMService"),
};

export interface DI_RETURN_TYPES {
  // Repositories
  IDoctorProfileRepository: IDoctorProfileRepository;
  IPatientProfileRepository: IPatientProfileRepository;
  IAppointmentRepository: IAppointmentRepository;
  IDoctorServiceRepository: IDoctorServiceRepository;
  IOrgAccessCheckRepository: IOrgAccessCheckRepository;
  IIdResolverRepository: IIdResolverRepository;
  IDoctorWeeklyAvailabilityRepository: IDoctorWeeklyAvailabilityRepository;
  IDoctorRepository: IDoctorRepository;

  // Services
  IABDMService: IABDMService;
}

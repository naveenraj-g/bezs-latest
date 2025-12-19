import { IAppStorageSettingRepository } from "../application/repositories/appStorageSettingRepository.interface";
import { ICloudStorageRepository } from "../application/repositories/cloudStorageRepository.interface";
import { IFileEntityRepository } from "../application/repositories/fileEntityRepository.interface";
import { IFileUploadRepository } from "../application/repositories/fileUploadRepository.interface";
import { ILocalStorageRepository } from "../application/repositories/localStorageRepository.interface";

export const DI_SYMBOLS = {
  // Repositorys
  ICloudStorageRepository: Symbol.for("ICloudStorageRepository"),
  ILocalStorageRepository: Symbol.for("ILocalStorageRepository"),
  IAppStorageSettingRepository: Symbol.for("IAppStorageSettingRepository"),
  IFileEntityRepository: Symbol.for("IFileEntityRepository"),
  IFileUploadRepository: Symbol.for("IFileUploadRepository"),
};

export interface DI_RETURN_TYPES {
  // Repositorys
  ICloudStorageRepository: ICloudStorageRepository;
  ILocalStorageRepository: ILocalStorageRepository;
  IAppStorageSettingRepository: IAppStorageSettingRepository;
  IFileEntityRepository: IFileEntityRepository;
  IFileUploadRepository: IFileUploadRepository;
}

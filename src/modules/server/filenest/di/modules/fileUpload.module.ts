import { Bind, ContainerModule } from "inversify";
import { DI_SYMBOLS } from "../types";
import { IFileUploadRepository } from "../../application/repositories/fileUploadRepository.interface";
import { FileUploadRepository } from "../../infrastructure/repositories/fileUploadRepository";

const initializeModules = ({ bind }: { bind: Bind }) => {
  bind<IFileUploadRepository>(DI_SYMBOLS.IFileUploadRepository)
    .to(FileUploadRepository)
    .inSingletonScope();
};

export const FileUploadModule = new ContainerModule(initializeModules);

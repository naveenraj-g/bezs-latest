import "reflect-metadata";
import { Container } from "inversify";
import { DI_RETURN_TYPES, DI_SYMBOLS } from "./types";
import {
  AppStorageSettingModule,
  CloudStorageModule,
  FileEntityModule,
  FilenestModule,
  FileUploadModule,
  LocalStorageModule,
} from "./modules";

const FilenestContainer = new Container({ defaultScope: "Singleton" });

const initializeContainer = () => {
  FilenestContainer.load(CloudStorageModule);
  FilenestContainer.load(LocalStorageModule);
  FilenestContainer.load(AppStorageSettingModule);
  FilenestContainer.load(FileEntityModule);
  FilenestContainer.load(FileUploadModule);
  FilenestContainer.load(FilenestModule);
};

initializeContainer();

export const getFilenestInjection = <K extends keyof typeof DI_SYMBOLS>(
  symbol: K
): DI_RETURN_TYPES[K] => {
  return FilenestContainer.get(DI_SYMBOLS[symbol]);
};

export { FilenestContainer };

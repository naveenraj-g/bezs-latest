import { AppRepository } from "../repositories/appRepository";
import { AppServices } from "./appServices";

export class ServiceLocator {
  private static _serviceCache: Record<string, any>;
  private static _repositoryCache: Record<string, any>;

  static {
    ServiceLocator._serviceCache = {};
    ServiceLocator._repositoryCache = {};
  }

  static getService(name: string) {
    const service = this._serviceCache[name];
    if (service) return service;

    if (name === AppServices.name) {
      let repository: AppRepository = this._repositoryCache[AppRepository.name];

      if (!repository) {
        repository = new AppRepository();
        this._repositoryCache[AppRepository.name] = repository;
      }

      const appServices = new AppServices(repository);
      this._serviceCache[name] = appServices;
      return appServices;
    }
  }
}

import { AppRepository } from "../repositories/appRepository";
import { AppService } from "./appService";

interface IServiceMap {
  AppService: AppService;
}

interface IRepositoryMap {
  AppRepository: AppRepository;
}

export class ServiceLocator {
  private static _serviceCache: Partial<Record<keyof IServiceMap, any>> = {};
  private static _repositoryCache: Partial<Record<keyof IRepositoryMap, any>> =
    {};

  private static _serviceFactory: {
    [k in keyof IServiceMap]: () => IServiceMap[k];
  } = {
    AppService: () => {
      const appRepository =
        ServiceLocator._getOrCreateRepository("AppRepository");
      return new AppService(appRepository);
    },
  };

  private static _repositoryFactory: {
    [k in keyof IRepositoryMap]: () => IRepositoryMap[k];
  } = {
    AppRepository: () => new AppRepository(),
  };

  private static _getOrCreateRepository<T extends keyof IRepositoryMap>(
    name: T
  ): IRepositoryMap[T] {
    let repository = this._repositoryCache[name];

    if (repository) {
      return repository;
    }

    repository = this._repositoryFactory[name]();
    this._repositoryCache[name] = repository;
    return repository;
  }

  static getService<T extends keyof IServiceMap>(name: T): IServiceMap[T] {
    const service = this._serviceCache[name];

    if (service) return service;

    const createdService = this._serviceFactory[name]();
    this._serviceCache[name] = createdService;
    return createdService;
  }
}

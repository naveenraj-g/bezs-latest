import { TGetUserFilesPayload } from "../../../../shared/entities/models/filenest/filenest";
import { TUserFiles } from "../../../../shared/entities/models/filenest/filenest";

export interface IFilenestRepository {
  getUserFiles(payload: TGetUserFilesPayload): Promise<TUserFiles>;
}

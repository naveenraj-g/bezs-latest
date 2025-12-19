import {
  TFileDatasSchema,
  TFileUploadRequiredDataSchema,
  TGetFileUploadRequiredData,
} from "../../../../shared/entities/models/filenest/fileUpload";

export interface IFileUploadRepository {
  getFileUploadRequiredData(
    getData: TGetFileUploadRequiredData
  ): Promise<TFileUploadRequiredDataSchema>;

  localUploadUserFile(payload: TFileDatasSchema): Promise<{ success: boolean }>;
}

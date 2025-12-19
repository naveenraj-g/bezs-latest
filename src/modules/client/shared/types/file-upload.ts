import { TGetFileUploadRequiredDataControllerOutput } from "@/modules/server/filenest/interface-adapters/controllers/fileUpload";
import { TSharedUser } from "@/modules/shared/types";
import { ZSAError } from "zsa";

export interface IFileUploadProps {
  fileUploadData?: TGetFileUploadRequiredDataControllerOutput | null;
  user: TSharedUser;
  modalError?: ZSAError | null;
}

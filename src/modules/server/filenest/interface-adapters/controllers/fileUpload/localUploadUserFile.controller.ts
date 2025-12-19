import { FileUploadValidationSchema } from "../../../../../shared/schemas/filenest/fileUploadValidationSchema";
import { InputParseError } from "../../../../../shared/entities/errors/commonError";
import { localUploadUserFileUseCase } from "../../../application/useCases/fileUpload/localUploadUserFile.useCase";

function presenter(data: { success: boolean }) {
  return data;
}

export type TLocalUploadUserFileControllerOutput = ReturnType<typeof presenter>;

export async function localUploadUserFileController(
  input: any
): Promise<TLocalUploadUserFileControllerOutput> {
  const { data, error: inputParseError } =
    await FileUploadValidationSchema.safeParseAsync(input);

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError });
  }

  const uploaded = await localUploadUserFileUseCase(data);
  return presenter(uploaded);
}

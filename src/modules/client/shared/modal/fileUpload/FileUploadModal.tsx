import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, X, File, CheckCircle2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSession } from "@/modules/client/auth/betterauth/auth-client";
import { useFileUploadStore } from "../../store/file-upload-store";
import { FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { FormSelect } from "@/modules/shared/custom-form-fields";
import ActionTooltipProvider from "@/modules/shared/providers/action-tooltip-provider";
import { formatStorage } from "@/modules/shared/helper";
import { useServerAction } from "zsa-react";
import { localUploadUserFile } from "../../server-actions/file-upload-action";
import { handleInputParseError } from "@/modules/shared/utils/handleInputParseError";
import { usePathname } from "@/i18n/navigation";
import { useQueryClient } from "@tanstack/react-query";

const uploadSchema = z.object({
  fileEntityId: z.bigint(),
});

type UploadFormData = z.infer<typeof uploadSchema>;

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  key?: string;
  isDeleting: boolean;
  status: "uploading" | "complete" | "error";
  objectUrl?: string;
}

export function UploadModal() {
  const session = useSession();
  const pathname = usePathname();
  const closeModal = useFileUploadStore((state) => state.onClose);
  const modalType = useFileUploadStore((state) => state.type);
  const isOpen = useFileUploadStore((state) => state.isOpen);
  const title = useFileUploadStore((state) => state.title);
  const description = useFileUploadStore((state) => state.description);
  const fileUploadData = useFileUploadStore((state) => state.fileUploadData);
  const modalError = useFileUploadStore((state) => state.error);
  const revalidatePath = useFileUploadStore((state) => state.revalidatePath);
  const queryKey = useFileUploadStore((state) => state.queryKey);

  const queryClient = useQueryClient();

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const isModalOpen = isOpen && modalType === "fileUpload";

  const fileEntitiesSelect = fileUploadData?.fileEntities?.map((entity) => ({
    label: entity.label,
    value: entity.id,
  }));

  const form = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      fileEntityId: undefined,
    },
  });

  useEffect(() => {
    if (
      fileUploadData?.fileEntities &&
      fileUploadData.fileEntities.length >= 1
    ) {
      form.reset({
        fileEntityId: fileUploadData.fileEntities[0].id,
      });
    }
  }, [fileUploadData?.fileEntities, form]);

  const { execute: localFileUpload, isPending: isLocalFileUploadPending } =
    useServerAction(localUploadUserFile, {
      onSuccess({ data }) {
        if (data?.success) {
          toast.success("File uploaded successfully.");
          if (queryKey) {
            queryClient.invalidateQueries({
              queryKey: queryKey,
            });
          }
          handleClose();
          return;
        }
        toast.error("An unexpected error occurred.", {
          description: "Failed to upload file.",
        });
      },
      onError({ err }) {
        const handled = handleInputParseError({
          err,
          form,
          toastMessage: "Form validation failed",
          toastDescription: "Please correct the highlighted fields below.",
        });

        if (handled) return;

        toast.error("An unexpected error occurred.", {
          description: err.message ?? "Please try again later.",
        });
      },
    });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        progress: 0,
        status: "uploading",
        isDeleting: false,
        objectUrl: URL.createObjectURL(file),
      }));

      setUploadedFiles((prev) => [...prev, ...newFiles]);

      newFiles.forEach((file) => {
        simulateUpload(file.id);
      });
    }
  }, []);

  const onDropRejected = useCallback(
    (fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        const tooManyFiles = fileRejections.find(
          (rejection) => rejection.errors[0].code === "too-many-files"
        );

        const fileTooLarge = fileRejections.find(
          (rejection) => rejection.errors[0].code === "file-too-large"
        );

        if (tooManyFiles) {
          toast.error("You can only upload up to 5 files at a time");
        }

        if (fileTooLarge) {
          toast.error(
            `File size must be less than ${
              fileUploadData?.maxFileSize ?? "100"
            }MB`
          );
        }
      }
    },
    [fileUploadData?.maxFileSize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    maxFiles: 5,
    maxSize: 1024 * 1024 * (fileUploadData?.maxFileSize ?? 100),
    // accept: {
    //   "image/*": [],
    //   "application/pdf": [".pdf"],
    // },
  });

  const simulateUpload = (id: string) => {
    let progress = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 30;

      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? {
                ...f,
                progress: Math.min(progress, 100),
                status: progress >= 100 ? "complete" : "uploading",
              }
            : f
        )
      );

      if (progress >= 100) clearInterval(interval);
    }, 200);
  };

  const removeFile = (file: UploadedFile) => {
    if (file.objectUrl) {
      URL.revokeObjectURL(file.objectUrl);
    }

    setUploadedFiles((prev) => prev.filter((f) => f.id !== file.id));
  };

  const handleSubmit = async (data: UploadFormData) => {
    if (!session || !session.data?.user || !session.data.user?.currentOrgId) {
      return;
    }

    const appSlug = pathname.split("/").filter(Boolean)?.[1];

    const uploadData = {
      revalidatePath,
      userId: session.data.user.id,
      orgId: session.data.user.currentOrgId,
      appSlug: appSlug,
      fileEntityId: data.fileEntityId,
      files: uploadedFiles
        .filter((fileData) => fileData.status === "complete")
        .map((fileData) => fileData.file),
    };

    if (
      uploadData.files.length === 0 ||
      !uploadData?.files.length ||
      !uploadData.fileEntityId
    ) {
      toast.error("No files to upload");
      return;
    }

    await localFileUpload(uploadData);
  };

  const handleClose = () => {
    uploadedFiles.forEach(
      (f) => f.objectUrl && URL.revokeObjectURL(f.objectUrl)
    );
    setUploadedFiles([]);
    form.reset();
    closeModal();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {title || "Upload Files"}
          </DialogTitle>
          <DialogDescription>
            {(description ||
              "Drag and drop files here, or browse your device to upload.") +
              ` Max file size ${formatStorage(
                fileUploadData?.maxFileSize || 0
              )}`}
          </DialogDescription>
        </DialogHeader>

        {modalError ? (
          <div>
            <p className="text-red-600">
              Error:{" "}
              {modalError.message ||
                "Something went wrong! Please try again later"}
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div
                className={`
                relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200
                ${
                  isDragActive
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }
              `}
                {...getRootProps()}
              >
                <input
                  type="file"
                  multiple
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,.doc,.docx,.dcm,.jpg,.jpeg,.png"
                  {...getInputProps()}
                />
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    {isDragActive ? (
                      <>
                        <p className="font-medium text-primary">
                          Drop files here to upload
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Release to start uploading
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium text-foreground">
                          Drag and drop files here
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          or click to browse from your device
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">
                    Uploaded Files
                  </p>
                  <div className="space-y-2 max-h-48 overflow-auto">
                    {uploadedFiles.map((uploadedFile, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg animate-scale-in"
                      >
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
                          {uploadedFile.status === "complete" ? (
                            uploadedFile?.objectUrl ? (
                              <img
                                src={uploadedFile.objectUrl}
                                alt={uploadedFile.id}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <CheckCircle2 className="w-5 h-5 text-success" />
                            )
                          ) : (
                            <File className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm break-all font-medium text-foreground whitespace-normal">
                            {uploadedFile.file.name}
                          </p>
                          {uploadedFile.status === "uploading" && (
                            <Progress
                              value={uploadedFile.progress}
                              className="h-1.5 mt-1.5"
                            />
                          )}
                        </div>
                        <div className="flex items-center">
                          <ActionTooltipProvider label="Remove">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFile(uploadedFile)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </ActionTooltipProvider>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <FormSelect
                control={form.control}
                name="fileEntityId"
                label="File Category"
                placeholder="Select a category"
                customValue={form.watch().fileEntityId?.toString()}
                onCustomChange={(value) => {
                  form.setValue("fileEntityId", BigInt(value));
                }}
              >
                {fileEntitiesSelect?.map((entitySelect) => (
                  <SelectItem
                    key={entitySelect.value}
                    value={entitySelect.value.toString()}
                  >
                    {entitySelect.label}
                  </SelectItem>
                ))}
              </FormSelect>

              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLocalFileUploadPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    uploadedFiles.length === 0 ||
                    uploadedFiles.some((f) => f.status === "uploading") ||
                    isLocalFileUploadPending
                  }
                >
                  {isLocalFileUploadPending ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload Files
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}

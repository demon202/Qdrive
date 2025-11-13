"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import Image from "next/image";
import Thumbnail from "@/components/Thumbnail";
import { MAX_FILE_SIZE } from "@/app/constants/index";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { handleFileUpload } from "@/lib/fileClient";

interface Props {
  ownerId: string;
  accountId: string;
  className?: string;
}

const FileUploader = ({ ownerId, accountId, className }: Props) => {
  const path = usePathname();
  const [files, setFiles] = useState<File[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Clear preview list when offline uploads finish syncing
  useEffect(() => {
    const handleFlush = () => {
      setFiles([]);
      setIsSyncing(false);
      toast.success("All offline uploads synced ✅");
    };

    document.addEventListener("uploads-flushed", handleFlush);
    return () => document.removeEventListener("uploads-flushed", handleFlush);
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);
      setIsSyncing(true);

      const uploadPromises = acceptedFiles.map(async (file) => {
        if (file.size > MAX_FILE_SIZE) {
          setFiles((prevFiles) =>
            prevFiles.filter((f) => f.name !== file.name),
          );
          return toast(`${file.name} is too large. Max file size is 50MB.`);
        }

        try {
          const result = await handleFileUpload({
            file,
            ownerId,
            accountId,
            path,
          });

          if (result?.offline) {
            toast(`${file.name} saved offline. Will sync later.`);
          } else {
            setFiles((prevFiles) =>
              prevFiles.filter((f) => f.name !== file.name),
            );
            toast(`${file.name} uploaded successfully!`);
          }
        } catch (err: any) {
          toast.error(`Upload failed for ${file.name}: ${err.message}`);
          console.error("Upload error:", err);
        }
      });

      await Promise.all(uploadPromises);
      setIsSyncing(false);
    },
    [ownerId, accountId, path],
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleRemoveFile = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    fileName: string,
  ) => {
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      <Button type="button" className={cn("uploader-button", className)}>
        <input {...getInputProps()} className="hidden" />
        <Image src="/assets/icons/upload.svg" alt="cloud with up arrow" width={24} height={24} />
        <p>Upload</p>
      </Button>

      {files.length > 0 && (
        <ul className="uploader-preview-list">
          <h4 className="h4 text-light-100">
            {isSyncing ? "Uploading / Queued" : "Uploading"}
          </h4>

          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);

            return (
              <li
                key={`${file.name}-${index}`}
                className="uploader-preview-item"
              >
                <div className="flex items-center gap-3">
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                  />

                  <div className="preview-item-name">
                    {file.name}
                    <Image
                      src="/assets/icons/file-loader.gif"
                      width={80}
                      height={26}
                      alt="Loader"
                      unoptimized={true}
                    />
                  </div>
                </div>

                <Image
                  src="/assets/icons/remove.svg"
                  width={24}
                  height={24}
                  alt="Remove"
                  onClick={(e) => handleRemoveFile(e, file.name)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FileUploader;

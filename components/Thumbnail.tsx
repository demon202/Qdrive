import React from "react";
import Image from "next/image";
import { cn, getFileIcon } from "@/lib/utils";

interface Props {
  type: string;
  extension?: string;
  url?: string;
  imageClassName?: string;
  className?: string;
}

export const Thumbnail = ({
  type,
  extension = "",
  url = "",
  imageClassName,
  className,
}: Props) => {
  const isImage = type === "image" && extension.toLowerCase() !== "svg";

  // fallback if extension is unknown
  const fallbackIcon = getFileIcon(extension, type) || "/default-file-icon.png";

  return (
    <figure className={cn("thumbnail", className)}>
      <Image
        src={isImage && url ? url : fallbackIcon}
        alt="thumbnail"
        width={100}
        height={100}
        className={cn(
          "size-8 object-contain",
          isImage && "thumbnail-image",
          imageClassName
        )}
      />
    </figure>
  );
};

export default Thumbnail;

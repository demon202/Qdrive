"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite/appwrite";
import { InputFile } from "node-appwrite/file";
import { ID, Models, Query } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/actions/user.actions";

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;
const filesCollectionId = process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION!;
const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET!;

if (!bucketId) throw new Error("Missing APPWRITE_BUCKET env variable.");

const handleError = (error: unknown, message: string) => {
  console.error(error, message);
  throw error;
};

// ==================== UPLOAD FILE ====================
export const uploadFile = async ({
  file,
  ownerId,
  accountId,
  path,
}: UploadFileProps) => {
  const { storage, databases } = await createAdminClient();
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("User not authenticated");

  try {
    // Make sure file is a Blob/File and has arrayBuffer
    let arrayBuffer: ArrayBuffer;

    if (typeof file.arrayBuffer === "function") {
      arrayBuffer = await file.arrayBuffer();
    } else {
      // Fallback for mobile
      arrayBuffer = await new Response(file).arrayBuffer();
    }

    const buffer = Buffer.from(arrayBuffer);
    const inputFile = InputFile.fromBuffer(buffer, file.name || `upload-${Date.now()}`);

    const bucketFile = await storage.createFile(bucketId, ID.unique(), inputFile);

    // Create database record
    const fileDocument = {
      type: getFileType(bucketFile.name).type,
      fullName: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      accountId,
      users: [],
      bucketFileId: bucketFile.$id,
    };

    const newFile = await databases
      .createDocument(databaseId, filesCollectionId, ID.unique(), fileDocument)
      .catch(async (error: unknown) => {
        await storage.deleteFile(bucketId, bucketFile.$id);
        handleError(error, "Failed to create file document");
      });

    revalidatePath(path);
    return parseStringify(newFile);
  } catch (error) {
    console.error("Upload failed:", error);
    handleError(error, "Failed to upload file");
  }
};


// ==================== GET FILES ====================
const createQueries = (
  currentUser: Models.Document,
  types: string[],
  searchText: string,
  sort: string,
  limit?: number
) => {
  const queries = [
    Query.or([
      Query.equal("owner", [currentUser.$id]),
      Query.contains("users", [currentUser.email]),
    ]),
  ];

  if (types.length > 0) queries.push(Query.equal("type", types));
  if (searchText) queries.push(Query.contains("fullName", searchText));
  if (limit) queries.push(Query.limit(limit));

  if (sort) {
    const [sortBy, orderBy] = sort.split("-");
    queries.push(orderBy === "asc" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy));
  }

  return queries;
};

export const getFiles = async ({
  types = [],
  searchText = "",
  sort = "$createdAt-desc",
  limit,
}: GetFilesProps) => {
  const { databases } = await createAdminClient();
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not found");

    const queries = createQueries(currentUser, types, searchText, sort, limit);
    const files = await databases.listDocuments(databaseId, filesCollectionId, queries);

    return parseStringify(files);
  } catch (error) {
    handleError(error, "Failed to get files");
  }
};

// ==================== RENAME FILE ====================
export const renameFile = async ({ fileId, name, extension, path }: RenameFileProps) => {
  const { databases } = await createAdminClient();
  try {
    const newName = `${name}.${extension}`;
    const updatedFile = await databases.updateDocument(databaseId, filesCollectionId, fileId, {
      fullName: newName,
      extension,
    });

    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, "Failed to rename file");
  }
};

// ==================== UPDATE FILE USERS ====================
export const updateFileUsers = async ({ fileId, emails, path }: UpdateFileUsersProps) => {
  const { databases } = await createAdminClient();
  try {
    const updatedFile = await databases.updateDocument(databaseId, filesCollectionId, fileId, {
      users: emails,
    });

    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, "Failed to update file users");
  }
};

// ==================== DELETE FILE ====================
export const deleteFile = async ({ fileId, bucketFileId, path }: DeleteFileProps) => {
  const { databases, storage } = await createAdminClient();
  try {
    await storage.deleteFile(bucketId, bucketFileId);
    await databases.deleteDocument(databaseId, filesCollectionId, fileId);

    revalidatePath(path);
    return parseStringify({ status: "success" });
  } catch (error) {
    handleError(error, "Failed to delete file");
  }
};

// ==================== TOTAL FILE SPACE USED ====================
export async function getTotalSpaceUsed() {
  try {
    const { databases } = await createSessionClient();
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User is not authenticated.");

    const files = await databases.listDocuments(databaseId, filesCollectionId, [
      Query.equal("owner", [currentUser.$id]),
    ]);

    const totalSpace = {
      image: { size: 0, latestDate: "" },
      document: { size: 0, latestDate: "" },
      video: { size: 0, latestDate: "" },
      audio: { size: 0, latestDate: "" },
      other: { size: 0, latestDate: "" },
      used: 0,
      all: 2 * 1024 * 1024 * 1024, // 2GB available bucket storage
    };

    files.documents.forEach((file) => {
      const fileType = file.type as FileType;
      totalSpace[fileType].size += file.size;
      totalSpace.used += file.size;

      if (!totalSpace[fileType].latestDate || new Date(file.$updatedAt) > new Date(totalSpace[fileType].latestDate)) {
        totalSpace[fileType].latestDate = file.$updatedAt;
      }
    });

    return parseStringify(totalSpace);
  } catch (error) {
    handleError(error, "Error calculating total space used");
  }
}

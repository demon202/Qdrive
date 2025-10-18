import { uploadFile } from "@/lib/actions/file.actions";
import { openDB } from "idb";

export async function handleFileUpload({ file, ownerId, accountId, path }: any) {
  if (navigator.onLine) {
    //  normal upload
    return await uploadFile({ file, ownerId, accountId, path });
  } else {
    // offline: save for later
    const db = await openDB("qdrive-offline", 2, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("pendingUploads")) {
          db.createObjectStore("pendingUploads", { keyPath: "id", autoIncrement: true });
        }
      },
    });

    await db.add("pendingUploads", {
      file,
      ownerId,
      accountId,
      path,
      createdAt: Date.now(),
    });

    return { offline: true };
  }
}

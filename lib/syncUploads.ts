"use client";

import { openDB } from "idb";
import { uploadFile } from "@/lib/actions/file.actions";

// Helper to confirm real connectivity
async function hasInternet(): Promise<boolean> {
  try {
    const res = await fetch("/", { method: "HEAD", cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}

export async function syncPendingUploads() {
  if (typeof window === "undefined") return;

  const db = await openDB("qdrive-offline", 2, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("pendingUploads")) {
        db.createObjectStore("pendingUploads", { keyPath: "id", autoIncrement: true });
      }
    },
  });

  const allFiles = await db.getAll("pendingUploads");

  for (const record of allFiles) {
    try {
      const { file, ownerId, accountId, path, id } = record;

      // Restore File from blob if needed
      const restoredFile =
        file instanceof File ? file : new File([file], file.name, { type: file.type });

      // ✅ Wait until real internet is back before attempting
      const online = await hasInternet();
      if (!online) {
        console.log("🌐 Network not ready yet, retry later...");
        return;
      }

      // Upload to Appwrite
      await uploadFile({ file: restoredFile, ownerId, accountId, path });

      // Delete record (fresh transaction per delete)
      const tx = db.transaction("pendingUploads", "readwrite");
      await tx.objectStore("pendingUploads").delete(id);
      await tx.done;
      document.dispatchEvent(new Event("uploads-flushed"));

      console.log(`✅ Synced file: ${restoredFile.name}`);
    } catch (err) {
      console.error("❌ Failed syncing", err);
    }
  }
}

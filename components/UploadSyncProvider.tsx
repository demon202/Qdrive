"use client";

import { useEffect } from "react";
import { syncPendingUploads } from "@/lib/syncUploads";

export function UploadSyncProvider() {
  useEffect(() => {
    const handleOnline = async () => {
      console.log("🌐 Back online → syncing pending uploads...");

      // Add a small delay (2s) to let connection stabilize
      await new Promise((res) => setTimeout(res, 2000));

      syncPendingUploads();
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  return null;
}

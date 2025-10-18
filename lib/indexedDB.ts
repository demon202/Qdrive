import { openDB } from "idb";

const DB_NAME = "qdrive";
const STORE_NAME = "uploads";

async function initDB() {
  return openDB(DB_NAME, 2, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    },
  });
}

export async function saveFileOffline(file: File) {
  const db = await initDB();
  await db.add(STORE_NAME, {
    file,
    createdAt: new Date(),
    status: "pending",
  });
}

export async function getPendingFiles() {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}

export async function removeFile(id: number) {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
}

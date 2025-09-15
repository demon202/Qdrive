import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import { createAdminClient } from "@/lib/appwrite/appwrite";
import { InputFile } from "node-appwrite/file";
import { ID } from "node-appwrite";
import { getFileType, constructFileUrl, parseStringify } from "@/lib/utils";

export const config = {
  api: {
    bodyParser: false, // we use formidable
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).json({ error: "Failed to parse form data" });
    }

    try {
      const { ownerId, accountId, path } = fields;
      const file = files.file as formidable.File;

      if (!file) return res.status(400).json({ error: "No file uploaded" });

      // Read file as buffer
      const buffer = fs.readFileSync(file.filepath);

      const { storage, databases } = await createAdminClient();

      const inputFile = InputFile.fromBuffer(buffer, file.originalFilename || `upload-${Date.now()}`);
      const bucketFile = await storage.createFile(process.env.NEXT_PUBLIC_APPWRITE_BUCKET!, ID.unique(), inputFile);

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
      

      const newFile = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
        process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION!,
        ID.unique(),
        fileDocument
      );

      return res.status(200).json(parseStringify(newFile));
    } catch (error) {
      console.error("Upload error:", error);
      return res.status(500).json({ error: "Failed to upload file" });
    }
  });
}

import multer from "multer";
import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from "dotenv";

dotenv.config();
export const upload = multer({ storage: multer.memoryStorage() });

export const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);
export const containerClient = blobServiceClient.getContainerClient(
  process.env.AZURE_CONTAINER_NAME
);

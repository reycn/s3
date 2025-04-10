import { S3Client, type S3File } from "bun";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import dotenv from 'dotenv';

dotenv.config();
export const S3_ENDPOINT = process.env.S3_ENDPOINT || "https://ny-1s.enzonix.com"; // Default value if not set
export const S3_BUCKET = process.env.S3_BUCKET || "bucket-1620-2220"; // Default value if not set
export const S3_REGION = process.env.S3_REGION || "us-east-1"; // Default value if not set
export const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;
export const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;

// console.log(process.env.S3_ENDPOINT);
const s3 = new S3Client({
    region: S3_REGION,
    bucket: S3_BUCKET,
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
    endpoint: process.env.S3_ENDPOINT,
} as const);

async function deleteFile(fileName: string) {
  try {
    const s3File: S3File = s3.file(fileName);
    await s3File.delete();
    console.log(`File "${fileName}" deleted successfully from S3.`);
  } catch (error) {
    console.error("Error deleting file:", error);
  }
}
const fileName = process.argv[2];
if (!fileName) {
    console.error("Please provide a file name as a command line argument.");
    }
else {
    await deleteFile(fileName);
}
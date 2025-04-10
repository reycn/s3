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

async function uploadFile(filePath: string) {
  const resolvedPath = resolve(filePath);

  if (!existsSync(resolvedPath)) {
    console.error(`File does not exist: ${resolvedPath}`);
    return;
  }

  const fileContent = readFileSync(resolvedPath, "utf-8");
  const fileName = resolvedPath.split("/").pop(); // Extract file name from path

  if (!fileName) {
    console.error("Could not determine file name.");
    return;
  }

  try {
    const s3File: S3File = s3.file(fileName);
    await s3File.write(fileContent);
    console.log(`File "${fileName}" uploaded successfully to S3.`);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}

const filePath = process.argv[2];

if (!filePath) {
  console.error("Please provide a file path as a command line argument.");
} else {
  await uploadFile(filePath);
}
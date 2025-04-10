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

async function listFiles() {
    try {
        const files = await s3.list();
        //   console.log("Files in S3 bucket:", files); // Inspect the structure of 'files'
        // only list file names

        if (files && Array.isArray(files.contents)) { // Check if files.Contents exists and is an array
            console.log("Files in (", files.name, "):");
            files.contents.forEach((file) => { // Updated to use 'contents' instead of 'Contents'
                console.log("-", file.key, "|", (file.size / 1000).toFixed(2), "KB"); // Assuming 'key' is the file name property
            });
        } else {
            console.error("Unexpected structure for files:", files);
        }
    } catch (error) {
        console.error("Error listing files:", error);
    }
}


listFiles();
import { v2 as cloudinary } from "cloudinary";
import * as fs from "node:fs/promises";

const { CLOUD_NAME, API_KEY, API_SECRET } = process.env;

cloudinary.config({
  secure: true,
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

export const saveFileToCloudinary = async (file) => {
  const response = await cloudinary.uploader.upload(file.path);
  await fs.unlink(file.path);
  return response.secure_url;
};

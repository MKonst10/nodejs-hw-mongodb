import path from "node:path";
import * as fs from "node:fs/promises";

import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from "../constants/index.js";

const { APP_DOMAIN } = process.env;

export const saveFileToUploadsDir = async (file) => {
  await fs.rename(
    path.join(TEMP_UPLOAD_DIR, file.filename),
    path.join(UPLOAD_DIR, file.filename)
  );

  return `${APP_DOMAIN}/${file.filename}`;
};

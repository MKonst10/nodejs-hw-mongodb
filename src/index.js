import { initMongoDB } from "./db/initMongoDB.js";
import { startServer } from "./server.js";

import { createDirIfNotExists } from "./utils/createDirIfNotExists.js";
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from "./constants/index.js";

const bootStrap = async () => {
  await createDirIfNotExists(TEMP_UPLOAD_DIR);
  await createDirIfNotExists(UPLOAD_DIR);
  await initMongoDB();
  startServer();
};

bootStrap();

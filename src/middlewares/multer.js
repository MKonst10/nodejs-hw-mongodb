import createHttpError from "http-errors";
import multer from "multer";
import { TEMP_UPLOAD_DIR } from "../constants/index.js";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, TEMP_UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniquePrefix = `${Date.now()}_${Math.round(Math.random() * 159)}`;
    const filename = `${uniquePrefix}_${file.originalname}`;
    cb(null, filename);
  },
});

const limits = {
  fileSize: 1024 * 1024 * 5,
};

const fileFilter = (req, file, cb) => {
  const extention = file.originalname.split(".").pop();
  if (extention === "exe") {
    return cb(createHttpError(400, "file with .exe extention not allow"));
  }
  cb(null, true);
};

export const upload = multer({ storage, limits, fileFilter });

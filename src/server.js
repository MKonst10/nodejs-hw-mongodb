import express from "express";
import cors from "cors";

import { getEnvVar } from "./utils/getEnvVar.js";

import contactsRouter from "./routers/contacts.js";
import { logger } from "./middlewares/logger.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";

export const startServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(logger);

  app.use("/contacts", contactsRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  const PORT = Number(getEnvVar("PORT", 3000));

  app.listen(PORT, () => console.log(`Server running on ${PORT} port`));
};

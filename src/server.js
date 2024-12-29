import express from "express";
import cors from "cors";
import pino from "pino-http";

import { getEnvVar } from "./utils/getEnvVar.js";

import contactsRouter from "./routers/contacts.js";

export const startServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(
    pino({
      transport: {
        target: "pino-pretty",
      },
    })
  );

  app.use("/contacts", contactsRouter);

  app.use("*", (req, res) => {
    res.status(404).json({
      message: `${req.url} not found`,
    });
  });

  app.use((error, req, res, next) => {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  });

  const PORT = Number(getEnvVar("PORT", 3000));

  app.listen(PORT, () => console.log(`Server running on ${PORT} port`));
};

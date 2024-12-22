import express from "express";
import cors from "cors";
import pino from "pino-http";

import { getEnvVar } from "./utils/getEnvVar.js";
import { getContactById, getContacts } from "./services/contacts.js";

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

  app.get("/contacts", async (req, res) => {
    try {
      const contacts = await getContacts();
      res.status(200).json({
        status: 200,
        message: "Successfully found contacts!",
        data: contacts,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to get contacts", error: error.message });
    }
  });

  app.get("/contacts/:contactId", async (req, res) => {
    const { contactId } = req.params;
    try {
      const contact = await getContactById(contactId);

      if (!contact) {
        return res.status(404).json({
          message: "Contact not found",
        });
      }

      res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
      });
    } catch (error) {
      res.status(500).json({
        message: "Some error occured",
        error: error.message,
      });
    }
  });

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

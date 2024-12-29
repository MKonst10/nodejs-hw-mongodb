import { Router } from "express";

import * as contactServices from "../services/contacts.js";

const contactsRouter = Router();

contactsRouter.get("/", async (req, res) => {
  try {
    const contacts = await contactServices.getContacts();
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

contactsRouter.get("/:contactId", async (req, res) => {
  const { contactId } = req.params;
  try {
    const contact = await contactServices.getContactById(contactId);

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

export default contactsRouter;

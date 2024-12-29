import createHttpError from "http-errors";

import * as contactServices from "../services/contacts.js";

export const getContactsController = async (req, res) => {
  const contacts = await contactServices.getContacts();
  res.status(200).json({
    status: 200,
    message: "Successfully found contacts!",
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const contact = await contactServices.getContactById(contactId);

    if (!contact) {
      throw createHttpError(404, `Contact with id ${contactId} not found`);
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

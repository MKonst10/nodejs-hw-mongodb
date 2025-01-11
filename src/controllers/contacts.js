import createHttpError from "http-errors";

import * as contactServices from "../services/contacts.js";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { parseContactFilterParams } from "../utils/filters/parseContactFilterParams.js";

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseContactFilterParams(req.query);
  filter.userId = req.user._id;

  const contacts = await contactServices.getContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.status(200).json({
    status: 200,
    message: "Successfully found contacts!",
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { id: _id } = req.params;

    const contact = await contactServices.getContact(_id, userId);

    if (!contact) {
      throw createHttpError(404, `Contact with id ${_id} not found`);
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${_id}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const addContactController = async (req, res) => {
  const { _id: userId } = req.user;
  const contact = await contactServices.addContact({ ...req.body, userId });
  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data: contact,
  });
};

export const upsertContactController = async (req, res, next) => {
  const { _id: userId } = req.user;
  const { id: _id } = req.params;
  const result = await contactServices.updateContact(
    _id,
    {
      ...req.body,
      userId,
    },
    { upsert: true }
  );

  if (!result) {
    throw createHttpError(404, `Contact with id ${_id} not found`);
  }

  const contact = await contactServices.getContactById(_id);

  res.status(200).json({
    status: 200,
    message: `Successfully patched a contact with id ${_id}!`,
    data: contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const result = await contactServices.deleteContact(contactId);

  if (!result) {
    throw createHttpError(404, `Contact with id ${contactId} not found`);
  }

  res.status(204).send();
};

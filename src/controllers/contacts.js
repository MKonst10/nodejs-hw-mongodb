import createHttpError from "http-errors";

import * as contactServices from "../services/contacts.js";
import { saveFileToUploadsDir } from "../utils/saveFileToUploadsDir.js";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { parseContactFilterParams } from "../utils/filters/parseContactFilterParams.js";
import { getEnvVar } from "../utils/getEnvVar.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";

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
  const cloudinaryEnable = getEnvVar("CLOUDINARY_ENABLE") === "true";
  let photo;
  if (req.file) {
    if (cloudinaryEnable) {
      photo = await saveFileToCloudinary(req.file);
    } else {
      photo = await saveFileToUploadsDir(req.file);
    }
  }
  const { _id: userId } = req.user;

  const contact = await contactServices.addContact({
    ...req.body,
    photo,
    userId,
  });

  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data: contact,
  });
};

export const upsertContactController = async (req, res, next) => {
  const { _id: userId } = req.user;
  const { contactId: _id } = req.params;

  const filter = { _id: _id };

  const result = await contactServices.updateContact(
    filter,
    {
      ...req.body,
      userId,
    },
    { upsert: true }
  );

  console.log("Request params ID:", _id);
  console.log("Update result:", result);

  if (!_id) {
    throw createHttpError(400, "ID parameter is required");
  }

  if (!result) {
    throw createHttpError(404, `Contact with id ${_id} not found`);
  }

  const contact = await contactServices.getContactById(_id);
  console.log("Retrieved contact:", contact);
  if (!contact) {
    throw createHttpError(500, "Failed to retrieve updated contact");
  }

  res.status(200).json({
    status: 200,
    message: `Successfully patched a contact with id ${_id}!`,
    data: contact,
  });
};

export const patchMovieController = async (req, res) => {
  const { _id: userId } = req.user;
  const { contactId: _id } = req.params;
  const result = await contactServices.updateContact({ _id, userId }, req.body);

  if (!result) {
    throw createHttpError(404, `Contact with id=${_id} not found`);
  }

  res.json({
    status: 200,
    message: "Successfully upsert contact",
    data: result.data,
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

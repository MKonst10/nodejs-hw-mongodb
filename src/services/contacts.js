import Contact from "../db/models/contacts.js";
import { calcPaginationData } from "../utils/calcPaginationData.js";

export const getContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = "name",
  sortOrder = "asc",
}) => {
  try {
    const limit = perPage;
    const skip = (page - 1) * limit;
    const contacts = await Contact.find()
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder });
    const totalItems = await Contact.countDocuments();
    const paginationData = calcPaginationData({ totalItems, page, perPage });

    return { contacts, totalItems, ...paginationData };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getContactById = async (contactId) => {
  try {
    const contact = await Contact.findById(contactId);
    return contact;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const addContact = (payload) => Contact.create(payload);

export const updateContact = async (_id, payload, options = {}) => {
  const { upsert = false } = options;
  const result = await Contact.findOneAndUpdate({ _id }, payload, {
    upsert,
    includeResultMetadata: true,
  });

  if (!result || !result.value) return null;

  const isNew = Boolean(result.lastErrorObject.upserted);

  return {
    isNew,
    data: result.value,
  };
};

export const deleteContact = async (_id) => {
  const result = await Contact.findOneAndDelete({ _id });
  return result;
};

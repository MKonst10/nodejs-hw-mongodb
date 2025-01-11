import Contact from "../db/models/contacts.js";
import { calcPaginationData } from "../utils/calcPaginationData.js";

export const getContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = "name",
  sortOrder = "asc",
  filter = {},
}) => {
  try {
    const limit = perPage;
    const skip = (page - 1) * limit;
    const contactsQuery = Contact.find();

    if (filter.isFavourite) {
      contactsQuery.where("isFavourite").equals(filter.isFavourite);
    }

    if (filter.userId) {
      contactsQuery.where("userId").equals(filter.userId);
    }

    const items = await contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder });
    const totalItems = await Contact.find()
      .merge(contactsQuery)
      .countDocuments();
    const paginationData = calcPaginationData({ totalItems, page, perPage });

    return { data: items, page, perPage, totalItems, ...paginationData };
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

export const getContact = (filter) => Contact.findOne(filter);

export const addContact = (payload) => Contact.create(payload);

export const updateContact = async (filter, payload, options = {}) => {
  const { upsert = false } = options;
  const result = await Contact.findOneAndUpdate(filter, payload, {
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

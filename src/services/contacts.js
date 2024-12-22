import Contact from "../db/models/contacts.js";

export const getContacts = () => {
  Contact.find();
};

export const getContactById = (contactId) => {
  Contact.findById(contactId);
};

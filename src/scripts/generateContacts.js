import { createFakeContact } from "../utils/createFakeContact.js";
import { readContacts } from "../utils/readContacts.js";
import { writeContacts } from "../utils/writeContacts.js";

const generateContacts = async (number) => {
  const contacts = await readContacts();
  const newContacts = Array(number).fill(0).map(createFakeContact);
  const contactList = [...contacts, ...newContacts];
  await writeContacts(contactList);
};

generateContacts(5);

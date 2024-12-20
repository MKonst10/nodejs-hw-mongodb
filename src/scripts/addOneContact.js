import { readContacts } from "../utils/readContacts.js";
import { createFakeContact } from "../utils/createFakeContact.js";
import { writeContacts } from "../utils/writeContacts.js";

export const addOneContact = async () => {
  const contacts = await readContacts();
  const contact = createFakeContact();
  await writeContacts([...contacts, contact]);
};

addOneContact();

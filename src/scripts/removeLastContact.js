import { readContacts } from "../utils/readContacts.js";
import { writeContacts } from "../utils/writeContacts.js";

export const removeLastContact = async () => {
  const contacts = await readContacts();
  contacts.pop();
  writeContacts(contacts);
};

removeLastContact();

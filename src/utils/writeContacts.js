import { PATH_DB } from "../constants/contacts.js";
import * as fs from "node:fs/promises";

export const writeContacts = (updatedContacts) =>
  fs.writeFile(PATH_DB, JSON.stringify(updatedContacts, null, 2));

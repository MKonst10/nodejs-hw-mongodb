import { readContacts } from "../utils/readContacts.js";

export const getAllContacts = async () => readContacts();

console.log(await getAllContacts());

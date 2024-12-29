import { Router } from "express";

import * as contactsController from "../controllers/contacts.js";

import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const contactsRouter = Router();

contactsRouter.get("/", ctrlWrapper(contactsController.getContactsController));

contactsRouter.get(
  "/:contactId",
  ctrlWrapper(contactsController.getContactByIdController)
);

contactsRouter.post(
  "/contacts",
  ctrlWrapper(contactsController.addContactController)
);

export default contactsRouter;

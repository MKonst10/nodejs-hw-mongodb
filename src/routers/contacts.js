import { Router } from "express";

import * as contactsController from "../controllers/contacts.js";

import { ctrlWrapper } from "../utils/ctrlWrapper.js";

import { validateBody } from "../utils/validateBody.js";

import {
  contactAddSchema,
  contactUpdateSchema,
} from "../validation/contacts.js";

import { isValidId } from "../middlewares/isValidId.js";

import { authenticate } from "../middlewares/authenticate.js";
import { upload } from "../middlewares/multer.js";

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", ctrlWrapper(contactsController.getContactsController));

contactsRouter.get(
  "/:contactId",
  isValidId,
  ctrlWrapper(contactsController.getContactByIdController)
);

contactsRouter.post(
  "/",
  upload.single("photo"),
  validateBody(contactAddSchema),
  ctrlWrapper(contactsController.addContactController)
);

contactsRouter.put(
  "/:id",
  upload.single("photo"),
  isValidId,
  validateBody(contactAddSchema),
  ctrlWrapper(contactsController.upsertContactController)
);

contactsRouter.patch(
  "/:contactId",
  upload.single("photo"),
  isValidId,
  validateBody(contactUpdateSchema),
  ctrlWrapper(contactsController.patchContactController)
);

contactsRouter.delete(
  "/:contactId",
  isValidId,
  ctrlWrapper(contactsController.deleteContactController)
);

export default contactsRouter;

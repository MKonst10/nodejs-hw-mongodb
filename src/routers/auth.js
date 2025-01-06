import { Router } from "express";

import * as authController from "../controllers/auth.js";

import { validateBody } from "../utils/validateBody.js";
import { authRegisterSchema } from "../validation/auth.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const authRouter = Router();

authRouter.post(
  "/",
  validateBody(authRegisterSchema),
  ctrlWrapper(authController.registerController)
);

export default authRouter;

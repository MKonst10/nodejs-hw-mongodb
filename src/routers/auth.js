import { Router } from "express";

import * as authController from "../controllers/auth.js";

import { validateBody } from "../utils/validateBody.js";
import { authLoginSchema, authRegisterSchema } from "../validation/auth.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const authRouter = Router();

authRouter.post(
  "/register",
  validateBody(authRegisterSchema),
  ctrlWrapper(authController.registerController)
);

authRouter.post(
  "/login",
  validateBody(authLoginSchema),
  ctrlWrapper(authController.loginController)
);

authRouter.post("/refresh", ctrlWrapper(authController.refreshTokenController));

authRouter.post("/logout", ctrlWrapper(authController.logoutController));

export default authRouter;

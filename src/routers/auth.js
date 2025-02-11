import { Router } from "express";

import * as authController from "../controllers/auth.js";

import { validateBody } from "../utils/validateBody.js";
import {
  authLoginSchema,
  authRegisterSchema,
  googleOAuthSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from "../validation/auth.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const authRouter = Router();

authRouter.post(
  "/register",
  validateBody(authRegisterSchema),
  ctrlWrapper(authController.registerController)
);

// authRouter.get("/verify", ctrlWrapper(authController.verifyController));

authRouter.post(
  "/send-reset-email",
  validateBody(requestResetEmailSchema),
  ctrlWrapper(authController.sendResetEmailController)
);

authRouter.post(
  "/reset-pwd",
  validateBody(resetPasswordSchema),
  ctrlWrapper(authController.resetPasswordController)
);

authRouter.get(
  "/get-oauth-url",
  ctrlWrapper(authController.getGoogleOAuthUrlController)
);

authRouter.post(
  "/confirm-oauth",
  validateBody(googleOAuthSchema),
  ctrlWrapper(authController.loginWithGoogleController)
);

authRouter.post(
  "/login",
  validateBody(authLoginSchema),
  ctrlWrapper(authController.loginController)
);

authRouter.post("/refresh", ctrlWrapper(authController.refreshTokenController));

authRouter.post("/logout", ctrlWrapper(authController.logoutController));

export default authRouter;

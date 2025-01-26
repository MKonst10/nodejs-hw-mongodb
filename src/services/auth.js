import User from "../db/models/User.js";
import Session from "../db/models/Session.js";

import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import path from "path";
import jwt from "jsonwebtoken";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import Handlebars from "handlebars";

import {
  accessTokenLifetime,
  refreshTokenLifetime,
} from "../constants/users.js";
import { TEMPLATES_DIR } from "../constants/index.js";
import { sendEmail } from "../utils/sendEmail.js";
import { getEnvVar } from "../utils/getEnvVar.js";
import {
  getUsernameFromGoogleTokenPayload,
  validateCode,
} from "../utils/gooogleOAuth2.js";

const { SMTP_FROM } = process.env;
const appDomain = getEnvVar("APP_DOMAIN");
const jwtSecret = getEnvVar("JWT_SECRET");

// const emailTemplatePath = path.join(TEMPLATES_DIR, "verify-email.html");
// const emailTemplateSource = await readFile(emailTemplatePath, "utf-8");

const createSessionData = () => ({
  accessToken: randomBytes(30).toString("base64"),
  refreshToken: randomBytes(30).toString("base64"),
  accessTokenValidUntil: Date.now() + accessTokenLifetime,
  refreshTokenValidUntil: Date.now() + refreshTokenLifetime,
});

export const register = async (payload) => {
  const { email, password } = payload;
  const user = await User.findOne({ email });

  if (user) {
    throw createHttpError(409, "User already exist");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...payload, password: hashPassword });

  //   const template = Handlebars.compile(emailTemplateSource);

  //   const token = jwt.sign({ email }, jwtSecret, { expiresIn: "1h" });

  //   const html = template({
  //     link: `${appDomain}/verify?token=${token}`,
  //   });

  //   const verifyEmail = {
  //     from: SMTP_FROM,
  //     to: email,
  //     subject: "Verify email",
  //     html,
  //   };

  //   await sendEmail(verifyEmail);

  return newUser;
};

// export const verify = async (token) => {
//   try {
//     const { email } = jwt.verify(token, jwtSecret);
//     const user = await User.findOne({ email });
//     if (!user) {
//       throw createHttpError(401, "User not found");
//     }
//     await User.findOneAndUpdate({ _id: user._id }, { verify: true });
//   } catch (error) {
//     throw createHttpError(401, error.message);
//   }
// };

export const login = async (payload) => {
  const { email, password } = payload;
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(401, "Email or password invalid");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, "Email or password invalid");
  }

  //   if (!user.verify) {
  //     throw createHttpError(401, "Email not verified");
  //   }

  await Session.deleteOne({ userId: user._id });

  const sessionData = createSessionData();

  return Session.create({
    userId: user._id,
    ...sessionData,
  });
};

export const requestResetToken = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(404, "User not found");
    }

    const resetToken = jwt.sign(
      {
        sub: user._id,
        email,
      },
      jwtSecret,
      {
        expiresIn: "15m",
      }
    );

    const resetPasswordTemplatePath = path.join(
      TEMPLATES_DIR,
      "reset-password-email.html"
    );

    if (!existsSync(resetPasswordTemplatePath)) {
      throw new Error(
        `Template file not found at path: ${resetPasswordTemplatePath}`
      );
    }

    const templateSource = (
      await readFile(resetPasswordTemplatePath)
    ).toString();

    const template = Handlebars.compile(templateSource);

    const html = template({
      name: user.name,
      link: `${appDomain}/auth/reset-pwd?token=${resetToken}`,
    });

    await sendEmail({
      from: SMTP_FROM,
      to: email,
      subject: "Reset your password",
      html,
    });
  } catch (error) {
    console.error("Error in requestResetToken:", error);
    throw error;
  }
};

export const resetPassword = async (payload) => {
  let entries;
  try {
    entries = jwt.verify(payload.token, jwtSecret);
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }
  const user = await User.findOne({
    email: entries.email,
    _id: entries.sub,
  });
  if (!user) {
    throw createHttpError(404, "User not found");
  }
  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await User.updateOne({ _id: user._id }, { password: encryptedPassword });
};

export const refreshToken = async (payload) => {
  const session = await Session.findOne({
    _id: payload.sessionId,
    refreshToken: payload.refreshToken,
  });
  if (!session) {
    throw createHttpError(401, "Session not found");
  }
  if (Date.now() > session.refreshTokenValidUntil) {
    throw createHttpError(401, "Refresh token expired");
  }
  await Session.deleteOne({ _id: payload.sessionId });

  const sessionData = createSessionData();

  return Session.create({
    userId: session.userId,
    ...sessionData,
  });
};

export const loginOrRegisterWithGoogle = async (code) => {
  const loginTicket = await validateCode(code);
  const payload = loginTicket.getPayload();

  if (!payload) throw createHttpError(401);

  let user = await User.findOne({ email: payload.email });
  if (!user) {
    const password = await bcrypt.hash(randomBytes(10).toString("base64"), 10);
    const name = getUsernameFromGoogleTokenPayload(payload);

    user = await User.create({
      email: payload.email,
      name,
      password,
    });
  }

  const sessionData = createSessionData();

  return await Session.create({
    userId: user._id,
    ...sessionData,
  });
};

export const logout = async (sessionId) => {
  await Session.deleteOne({ _id: sessionId });
};

export const getUser = (filter) => {
  return User.findOne(filter);
};

export const getSession = (filter) => {
  return Session.findOne(filter);
};

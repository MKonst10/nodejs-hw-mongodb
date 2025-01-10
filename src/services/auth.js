import User from "../db/models/User.js";
import Session from "../db/models/Session.js";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import {
  accessTokenLifetime,
  refreshTokenLifetime,
} from "../constants/users.js";

export const register = async (payload) => {
  const { email, password } = payload;
  const user = await User.findOne({ email });

  if (user) {
    throw createHttpError(409, "User already exist");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...payload, password: hashPassword });

  return newUser;
};

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

  await Session.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString("base64");
  const refreshToken = randomBytes(30).toString("base64");

  return Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: Date.now() + accessTokenLifetime,
    refreshTokenValidUntil: Date.now() + refreshTokenLifetime,
  });
};

export const getUser = (filter) => {
  return User.findOne(filter);
};

export const getSession = (filter) => {
  return Session.findOne(filter);
};

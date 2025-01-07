import User from "../db/models/User.js";
import createHttpError from "http-errors";

export const register = async (payload) => {
  const { email } = payload;
  const user = await User.findOne({ email });

  if (user) {
    throw createHttpError(409, "User already exist");
  }

  const newUser = await User.create(payload);

  return newUser;
};

import * as authServices from "../services/auth.js";

export const registerController = async (req, res) => {
  await authServices.register(req.body);

  res.status(201).json({
    status: 201,
    message: "Successfully registered user",
  });
};

export const loginController = async (req, res) => {
  const session = await authServices.login(req.body);

  res.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie("sessionId", session.id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.status(200).json({
    status: 200,
    message: "Successfully logged in an user!",
    data: {
      accessToken: session.accessToken,
    },
  });
};

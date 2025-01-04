import createHttpError from "http-errors";

export const validateBody = (schema) => {
  const func = async (req, res, next) => {
    try {
      await schema.validate(req.body, {
        abortEarly: false,
      });
      next();
    } catch (error) {
      throw createHttpError(404, error.message);
    }
  };
  return func;
};

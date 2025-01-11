const parsedBoolean = (param) => {
  const isString = typeof param === "string";

  if (!isString) return;

  const isBoolean = ["true", "false"].includes(param);

  if (isBoolean) return param;
};
export const parseContactFilterParams = ({ isFavourite }) => {
  const parseIsFavourite = parsedBoolean(isFavourite);

  return {
    isFavourite: parseIsFavourite,
  };
};

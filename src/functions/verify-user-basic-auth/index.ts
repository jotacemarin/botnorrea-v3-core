import { Context } from "hono";

export const verifyUser = (
  username: string,
  password: string,
  c: Context
) => {
  const userValid = username === c.env.PUBLIC_WEBHOOK_USERNAME;
  const passValid = password === c.env.PUBLIC_WEBHOOK_PASSWORD;
  return userValid && passValid;
};

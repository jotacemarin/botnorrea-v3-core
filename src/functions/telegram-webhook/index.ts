import { Context } from "hono";
import { status } from "http-status";

export const telegramWebhook = async (c: Context) => {
  const secret = c.req.query("secret");
  if (secret !== c.env.TELEGRAM_WEBHOOK_SECRET) {
    return c.status(status.UNAUTHORIZED);
  }

  const body = await c.req.json();
  if (!body?.message?.text) {
    return c.status(status.BAD_REQUEST);
  }

  // TODO: Handle the message
  return c.status(status.OK);
};

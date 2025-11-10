import { Context } from "hono";
import { status } from "http-status";

export const telegramWebhook = async (c: Context) => {
  const body = await c.req.json();
  if (!body?.message?.text) {
    return c.json({ error: "Bad Request" }, status.BAD_REQUEST);
  }

  // TODO: Handle the message
  console.log("telegramWebhook >>>", JSON.stringify(body, null, 2));

  return c.json({ message: "Message received" }, status.OK);
};

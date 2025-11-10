import { Context } from "hono";
import { status } from "http-status";
import { telegramDebug } from "./telegram-debug";

export const telegramWebhook = async (c: Context) => {
  const body = await c.req.json();

  await telegramDebug(body);
  // TODO: Handle the message

  return c.json({ message: "Message received" }, status.OK);
};

import { Context } from "hono";
import { status } from "http-status";
import { telegramCoreCommands } from "./telegram-core-commands";
import { telegramSaveEvent } from "./telegram-save-event";
import { telegramSaveUser } from "./telegram-save-user";

export const telegramWebhook = async (c: Context) => {
  const body = await c.req.json();

  await Promise.allSettled([
    telegramCoreCommands(body),
    telegramSaveEvent(body),
    telegramSaveUser(body),
  ]);

  return c.json({ message: "Message received" }, status.OK);
};

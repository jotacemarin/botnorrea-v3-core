import { Update_Telegram } from "../../../interfaces";
import { handler } from "./commands";

export const telegramCoreCommands = async (body: Update_Telegram) => {
  if (!body || !body.message) {
    return;
  }

  await handler(body);

  return;
};

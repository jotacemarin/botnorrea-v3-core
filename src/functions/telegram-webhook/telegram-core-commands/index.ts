import { Update_Telegram } from "../../../interfaces";
import { COMMANDS } from "./commands";
import { getCommand } from "./get-command";

export const telegramCoreCommands = async (body: Update_Telegram) => {
  if (!body || !body.message) {
    return;
  }

  const command = getCommand(body);
  const handler = COMMANDS[command as keyof typeof COMMANDS];
  if (!handler) {
    return;
  }

  await handler(body);

  return;
};

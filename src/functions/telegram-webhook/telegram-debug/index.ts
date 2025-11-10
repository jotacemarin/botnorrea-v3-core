import {
  FormattingOptions_Telegram,
  Update_Telegram,
} from "../../../models/telegram";
import { TelegramService } from "../../../services";
import { getCommand } from "./get-command";

const getMessageToDebug = (body: Update_Telegram): string => {
  if (body?.message?.reply_to_message) {
    return JSON.stringify(body.message.reply_to_message, null, 2);
  }

  return JSON.stringify(body, null, 2);
};

export const telegramDebug = async (body: Update_Telegram) => {
  if (!body || !body.message) {
    return;
  }

  const key = getCommand(body);
  if (key !== "/debug") {
    return;
  }

  console.log(`telegramDebug: ${JSON.stringify(body)}`);
  const messageToDebug = getMessageToDebug(body);

  await TelegramService.sendMessage({
    chat_id: body.message.chat.id,
    reply_to_message_id: body.message.message_id,
    parse_mode: FormattingOptions_Telegram.HTML,
    text: `<code>${messageToDebug}</code>`,
  });
};

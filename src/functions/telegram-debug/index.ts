import { Context } from "hono";
import { status } from "http-status";
import {
  FormattingOptions_Telegram,
  Update_Telegram,
} from "../../models/telegram";
import { TelegramService } from "../../services";

const getMessageToDebug = (body: Update_Telegram): string => {
  console.log(`telegramDebug: ${JSON.stringify(body, null, 2)}`);
  if (body?.message?.reply_to_message) {
    return JSON.stringify(body.message.reply_to_message, null, 2);
  }

  return JSON.stringify(body, null, 2);
};

export const telegramDebug = async (c: Context) => {
  const body = (await c.req.json()) as Update_Telegram;
  if (!body || !body.message) {
    return c.json(
      { success: false, message: "Invalid request" },
      status.BAD_REQUEST
    );
  }

  const messageToDebug = getMessageToDebug(body);

  await TelegramService.sendMessage({
    chat_id: body.message.chat.id,
    reply_to_message_id: body.message.message_id,
    parse_mode: FormattingOptions_Telegram.HTML,
    text: `<code>${messageToDebug}</code>`,
  });

  return c.json({ success: true }, status.OK);
};

import { Context } from "hono";
import { TelegramService } from "../../../services";
import status from "http-status";
import { ContentfulStatusCode } from "hono/utils/http-status";

export const sendMessageToTelegram = async (
  body: any,
  c: Context
): Promise<{
  code: ContentfulStatusCode;
  result: { error?: string; message?: string };
}> => {
  if (!body?.chat_id) {
    return {
      code: status.BAD_REQUEST,
      result: { error: "chat_id is missing" },
    };
  }

  if (!body?.text && !body?.photo && !body?.video) {
    return {
      code: status.BAD_REQUEST,
      result: { error: "text, photo or video params are missing" },
    };
  }

  if (body?.photo && body?.video) {
    return {
      code: status.BAD_REQUEST,
      result: { error: "too many params" },
    };
  }

  if (body?.media_is_spoiler && typeof body?.media_is_spoiler !== "boolean") {
    return {
      code: status.BAD_REQUEST,
      result: { error: "media_is_spoiler param is not boolean" },
    };
  }

  if (body?.text_is_spoiler && typeof body?.text_is_spoiler !== "boolean") {
    return {
      code: status.BAD_REQUEST,
      result: { error: "text_is_spoiler param is not boolean" },
    };
  }

  TelegramService.initInstance(c.env.TELEGRAM_BOT_TOKEN);

  await TelegramService.sendMessage({
    chat_id: body.chat_id,
    text: body.text,
  });

  return {
    code: status.OK,
    result: { message: "Message sent successfully" },
  };
};

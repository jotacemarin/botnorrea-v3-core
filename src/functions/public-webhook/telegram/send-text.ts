import status from "http-status";
import { TelegramService } from "../../../services";
import { ContentfulStatusCode } from "hono/utils/http-status";

export const sendText = async (
  body: any
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

  try {
    await TelegramService.sendMessage({
      chat_id: body.chat_id,
      text: body.text,
      parse_mode: body?.parse_mode,
      entities: body?.entities,
      disable_notification: body?.disable_notification,
      protect_content: body?.protect_content,
      reply_parameters: body?.reply_parameters,
      reply_markup: body?.reply_markup,
    });

    return {
      code: status.OK,
      result: { message: "Photo sent successfully" },
    };
  } catch (error) {
    return {
      code: status.INTERNAL_SERVER_ERROR,
      result: { error: "Failed to send photo" },
    };
  }
};

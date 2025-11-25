import status from "http-status";
import { Context } from "hono";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { sendPhoto } from "./send-photo";
import { sendVideo } from "./send-video";
import { sendText } from "./send-text";

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

  if (body?.photo && body?.video) {
    return {
      code: status.BAD_REQUEST,
      result: { error: "too many params" },
    };
  }

  if (body?.photo) {
    return sendPhoto(body);
  }

  if (body?.video) {
    return sendVideo(body);
  }

  if (body?.text) {
    return sendText(body);
  }

  return {
    code: status.BAD_REQUEST,
    result: { error: "no params provided" },
  };
};

import { Update_Telegram } from "../../../interfaces";
import { WebhookQueueService } from "../../../services";
import { getBotnorrea } from "./get-botnorrea";

export const telegramCoreMention = async (body: Update_Telegram) => {
  if (!body || !body.message) {
    return;
  }

  const botnorrea = await getBotnorrea(body);
  if (!botnorrea) {
    return;
  }

  const message = body.message;
  const text = message?.text ?? message?.caption ?? "";
  if (text.replace(`@${botnorrea.username}`, "").trim() === "") {
    return;
  }

  const service = "telegram";
  const chatId = String(message.chat.id);
  const eventId = String(body.update_id);

  await WebhookQueueService.sendMessage({
    service: `${service}:${chatId}`,
    eventId,
  });

  return;
};

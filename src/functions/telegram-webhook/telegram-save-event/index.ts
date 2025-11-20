import { IEvent_Botnorrea, Update_Telegram } from "../../../interfaces";
import { EventService } from "../../../services";
import { randomUUID } from "crypto";

export const telegramSaveEvent = async (
  body: Update_Telegram
): Promise<void> => {
  if (!body || !body?.message) {
    return;
  }

  const service = "telegram";

  const event: IEvent_Botnorrea = {
    id: randomUUID(),
    service: `${service}:${String(body.message.chat.id)}`,
    eventId: String(body.update_id),
    from: String(body.message.from.id),
    date: body.message.date,
    text: body.message.text ?? body.message.caption ?? "",
    data: { [service]: body },
  };

  await EventService.create(event);

  return;
};

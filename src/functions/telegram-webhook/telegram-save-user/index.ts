import { Update_Telegram } from "../../../interfaces";
import { IUser_Botnorrea } from "../../../interfaces/user";
import { UserService } from "../../../services/users";

export const telegramSaveUser = async (body: Update_Telegram) => {
  if (!body || !body.message) {
    return;
  }

  const service = "telegram";

  const user: IUser_Botnorrea = {
    id: `${service}:${String(body.message.from.id)}`,
    service,
    isBot: body.message.from.is_bot,
    firstName: body.message.from.first_name,
    lastName: body.message.from.last_name,
    languageCode: body.message.from.language_code,
    username: body.message.from.username,
    data: { [service]: body.message.from },
  };

  await UserService.save(user);

  return;
};

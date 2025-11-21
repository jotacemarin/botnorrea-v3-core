import {
  EntityType_Telegram,
  Update_Telegram,
  User_Telegram,
  IUser_Botnorrea,
} from "../../../interfaces";
import { TelegramService, UserService } from "../../../services";

const BOT_USERNAME = process.env.BOT_USERNAME ?? "";

const getUserData = async (
  username: string,
  chatId: number
): Promise<{
  botnorreaUser: IUser_Botnorrea;
  telegramUser: {
    user: User_Telegram;
    status: string;
    is_anonymous: boolean;
  };
} | null> => {
  const fromBotnorrea = await UserService.getByUsername(username);
  if (!fromBotnorrea) {
    return null;
  }

  const fromTelegram = await TelegramService.getChatMember(
    chatId,
    fromBotnorrea.id.replace("telegram:", "")
  );
  if (!fromTelegram?.data?.result?.user) {
    return null;
  }

  return {
    botnorreaUser: fromBotnorrea,
    telegramUser: fromTelegram.data.result,
  };
};

export const getUsersMentioned = async (
  body: Update_Telegram
): Promise<
  Array<{
    botnorreaUser: IUser_Botnorrea;
    telegramUser: {
      user: User_Telegram;
      status: string;
      is_anonymous: boolean;
    };
  }>
> => {
  if (!body || !body?.message) {
    return [];
  }

  const message = body.message;

  const positions = message.entities?.filter(
    (entity) => entity.type === EntityType_Telegram.MENTION
  );

  if (!positions?.length) {
    return [];
  }

  const usernames = positions
    .map((position) => {
      const text = message.text ?? message.caption ?? "";
      return text
        .substring(position.offset, position.offset + position.length)
        .replace("@", "")
        .trim();
    })
    .filter((username) => username !== BOT_USERNAME)
    .filter(Boolean);

  if (!usernames?.length) {
    return [];
  }

  const request = await Promise.allSettled(
    usernames.map((username) => getUserData(username, message.chat.id))
  );

  return request
    .filter((request) => request.status === "fulfilled")
    .map((request) => request.value)
    .filter((user) => user !== null);
};

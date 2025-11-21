import {
  Entity_Telegram,
  EntityType_Telegram,
  Update_Telegram,
} from "../../../interfaces";
import { TelegramService } from "../../../services";

const BOT_USERNAME = process.env.BOT_USERNAME ?? "";

export const getBotnorrea = async (
  body: Update_Telegram
): Promise<{
  username: string;
  position: Entity_Telegram;
  id: number;
  isBot: boolean;
  firstName: string;
  canJoinGroups: boolean;
  canReadAllGroupMessages: boolean;
  supportsInlineQueries: boolean;
  canConnectToBusiness: boolean;
  hasMainWebApp: boolean;
} | null> => {
  if (!body || !body?.message) {
    return null;
  }

  const message = body.message;

  const positions = message.entities?.filter(
    (entity) => entity.type === EntityType_Telegram.MENTION
  );

  if (!positions?.length) {
    return null;
  }

  const usernames = positions
    .map((position) => {
      const text = message.text ?? message.caption ?? "";
      const username = text
        .substring(position.offset, position.offset + position.length)
        .replace("@", "")
        .trim();

      return { username, position };
    })
    .filter((mention) => mention.username === BOT_USERNAME);

  if (!usernames?.length) {
    return null;
  }

  const me = await TelegramService.getMe();
  if (!me?.data?.result) {
    return null;
  }

  const local = usernames[0];
  const telegram = me.data.result;

  return {
    ...local,
    id: telegram.id,
    isBot: telegram.is_bot,
    firstName: telegram.first_name,
    canJoinGroups: telegram.can_join_groups,
    canReadAllGroupMessages: telegram.can_read_all_group_messages,
    supportsInlineQueries: telegram.supports_inline_queries,
    canConnectToBusiness: telegram.can_connect_to_business,
    hasMainWebApp: telegram.has_main_web_app,
  };
};

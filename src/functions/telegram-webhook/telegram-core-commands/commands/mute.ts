import { Update_Telegram } from "../../../../interfaces";
import { TelegramService } from "../../../../services";
import { getUsersMentioned } from "../get-users-mentioned";

const MILLISECONDS = 1000;
const SECONDS = 60;
const MINUTES_TO_MUTE = 15;

const restrictChatMember = async (
  chatId: number,
  userId: number,
  minutes: number
) => {
  await TelegramService.restrictChatMember({
    chat_id: chatId,
    user_id: userId,
    permissions: {
      can_send_messages: false,
      can_send_audios: false,
      can_send_documents: false,
      can_send_photos: false,
      can_send_videos: false,
      can_send_video_notes: false,
      can_send_voice_notes: false,
      can_send_polls: false,
      can_send_other_messages: false,
      can_add_web_page_previews: false,
      can_change_info: false,
      can_invite_users: false,
      can_pin_messages: false,
      can_manage_topics: false,
    },
    until_date: Date.now() + MILLISECONDS * SECONDS * minutes,
  });
};

export const mute = async (
  body: Update_Telegram,
  minutes: number = MINUTES_TO_MUTE
) => {
  if (!body || !body?.message) {
    return;
  }

  const users = await getUsersMentioned(body);
  if (!users?.length) {
    return;
  }

  for (const user of users) {
    const userData = user.telegramUser.user;
    const username = userData.username;
    const chatId = body.message.chat.id;

    if (user.telegramUser.status === "member") {
      try {
        await restrictChatMember(chatId, Number(userData.id), minutes);
        await TelegramService.sendMessage({
          chat_id: chatId,
          text: `User @${username} has been muted for ${minutes} minutes`,
        });
      } catch (error) {
        console.error(`Error muting user ${username}`, error);
        await TelegramService.sendMessage({
          chat_id: chatId,
          text: `Error muting user @${username}`,
        });
      }
    }
  }

  return;
};

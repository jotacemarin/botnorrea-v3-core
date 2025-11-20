import { Update_Telegram } from "../../../../interfaces";
import { getUsersMentioned } from "../get-users-mentioned";
import { TelegramService } from "../../../../services";

const unrestrictChatMember = async (chatId: number, userId: number) => {
  await TelegramService.restrictChatMember({
    chat_id: chatId,
    user_id: userId,
    permissions: {
      can_send_messages: true,
      can_send_audios: true,
      can_send_documents: true,
      can_send_photos: true,
      can_send_videos: true,
      can_send_video_notes: true,
      can_send_voice_notes: true,
      can_send_polls: true,
      can_send_other_messages: true,
      can_add_web_page_previews: true,
      can_change_info: true,
      can_invite_users: true,
      can_pin_messages: true,
      can_manage_topics: true,
    },
  });
};

export const unmute = async (body: Update_Telegram) => {
  if (!body || !body.message) {
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

    if (user.telegramUser.status === "restricted") {
      try {
        await unrestrictChatMember(chatId, Number(userData.id));
        await TelegramService.sendMessage({
          chat_id: chatId,
          text: `User @${username} has been unmuted`,
        });
      } catch (error) {
        console.error(`Error unmuting user ${username}`, error);
        await TelegramService.sendMessage({
          chat_id: chatId,
          text: `Error unmuting user @${username}`,
        });
      }
    }
  }

  return;
};

import axios, { AxiosResponse } from "axios";
import {
  Entity_Telegram,
  User_Telegram,
  FormattingOptions_Telegram,
  Message_Telegram,
  ITelegramService,
} from "../../interfaces";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? "";

interface SendMessageResponse_Telegram {
  ok: boolean;
  result: {
    message_id: number;
    message_thread_id: number;
    from: User_Telegram;
    sender_chat: any;
    date: number;
    entities: Array<Entity_Telegram>;
  };
}

const instance = axios.create({
  baseURL: `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`,
});

const setWebhook = (
  url: string
): Promise<
  AxiosResponse<{
    ok: boolean;
    result: boolean;
    description: string;
  }>
> => {
  return instance.post("/setWebhook", { url });
};

const getWebhookInfo = (): Promise<
  AxiosResponse<{
    ok: boolean;
    result: {
      url: string;
      has_custom_certificate: boolean;
      pending_update_count: number;
      max_connections: number;
      ip_address: string;
    };
  }>
> => {
  return instance.get("/getWebhookInfo");
};

const sendMessage = (params: {
  chat_id: number | string;
  text: string;
  message_thread_id?: number;
  parse_mode?: FormattingOptions_Telegram;
  entities?: Array<Entity_Telegram>;
  protect_content?: boolean;
  reply_to_message_id?: number;
  reply_markup?: {
    inline_keyboard: Array<any>;
  };
  has_spoiler?: boolean;
}): Promise<AxiosResponse<SendMessageResponse_Telegram>> => {
  return instance.post("/sendMessage", params);
};

const editMessage = (params: {
  chat_id: number | string;
  message_id: number | string;
  text: string;
  message_thread_id?: number;
  parse_mode?: FormattingOptions_Telegram;
  entities?: Array<Entity_Telegram>;
  protect_content?: boolean;
  reply_to_message_id?: number;
  reply_markup?: {
    inline_keyboard: Array<any>;
  };
  has_spoiler?: boolean;
}): Promise<AxiosResponse<SendMessageResponse_Telegram>> => {
  return instance.post("/editMessageText", params);
};

const sendPhoto = (params: {
  chat_id: number | string;
  photo: string;
  caption?: string;
  parse_mode?: FormattingOptions_Telegram;
  caption_entities?: Array<Entity_Telegram>;
  reply_to_message_id?: number;
  allow_sending_without_reply?: boolean;
  protect_content?: boolean;
  reply_markup?: {
    inline_keyboard: Array<any>;
  };
  has_spoiler?: boolean;
}): Promise<AxiosResponse<SendMessageResponse_Telegram>> => {
  return instance.post("/sendPhoto", params);
};

const sendVideo = (params: {
  chat_id: number | string;
  video: string;
  caption?: string;
  parse_mode?: FormattingOptions_Telegram;
  caption_entities?: Array<Entity_Telegram>;
  reply_to_message_id?: number;
  allow_sending_without_reply?: boolean;
  protect_content?: boolean;
  reply_markup?: {
    inline_keyboard: Array<any>;
  };
  has_spoiler?: boolean;
}): Promise<AxiosResponse<SendMessageResponse_Telegram>> => {
  return instance.post("/sendVideo", params);
};

const getChat = (
  chatId: number | string
): Promise<
  AxiosResponse<{
    ok: boolean;
    result: {
      id: number | string;
      title: string;
      username: string;
      type: string;
    };
  }>
> => {
  return instance.get("/getChat", {
    params: { chat_id: chatId },
  });
};

const getChatMember = (
  chatId: number | string,
  userId: number | string
): Promise<
  AxiosResponse<{
    ok: boolean;
    result: {
      user: User_Telegram;
      status: string;
      is_anonymous: boolean;
    };
  }>
> => {
  return instance.get("/getChatMember", {
    params: { chat_id: chatId, user_id: userId },
  });
};

const getMe = (): Promise<
  AxiosResponse<{
    ok: boolean;
    result: {
      id: number;
      is_bot: boolean;
      first_name: string;
      username: string;
      can_join_groups: boolean;
      can_read_all_group_messages: boolean;
      supports_inline_queries: boolean;
      can_connect_to_business: boolean;
      has_main_web_app: boolean;
    };
  }>
> => {
  return instance.get("/getMe");
};

const editMessageReplyMarkup = (params: {
  chat_id: number | string;
  message_id: number | string;
  reply_markup: {
    inline_keyboard: Array<any>;
  };
}): Promise<
  AxiosResponse<{
    ok: boolean;
    result: Message_Telegram;
  }>
> => {
  return instance.post("/editMessageReplyMarkup", params);
};

const restrictChatMember = async (params: {
  chat_id: number | string;
  user_id: number | string;
  permissions: {
    can_send_messages: boolean;
    can_send_audios: boolean;
    can_send_documents: boolean;
    can_send_photos: boolean;
    can_send_videos: boolean;
    can_send_video_notes: boolean;
    can_send_voice_notes: boolean;
    can_send_polls: boolean;
    can_send_other_messages: boolean;
    can_add_web_page_previews: boolean;
    can_change_info: boolean;
    can_invite_users: boolean;
    can_pin_messages: boolean;
    can_manage_topics: boolean;
  };
  until_date?: number;
}): Promise<AxiosResponse<{ ok: boolean; result: boolean }>> => {
  return instance.post("/restrictChatMember", params);
};

const deleteMessage = (params: {
  chat_id: number | string;
  message_id?: number | string;
  message_ids?: Array<number | string>;
}): Promise<
  AxiosResponse<{
    ok: boolean;
    result: boolean;
  }>
> => {
  return instance.post("/deleteMessage", params);
};

export const TelegramService: ITelegramService = {
  setWebhook,
  getWebhookInfo,
  sendMessage,
  editMessage,
  sendPhoto,
  sendVideo,
  getChat,
  getChatMember,
  getMe,
  editMessageReplyMarkup,
  restrictChatMember,
  deleteMessage,
};

import { AxiosResponse } from "axios";

export enum ChatType_Telegram {
  PRIVATE = "private",
  GROUP = "group",
  SUPERGROUP = "supergroup",
}

export enum EntityType_Telegram {
  BOT_COMMAND = "bot_command",
  MENTION = "mention",
}

export enum FormattingOptions_Telegram {
  MARKDOWN_V2 = "MarkdownV2",
  HTML = "HTML",
  MARKDOWN = "Markdown",
}

export interface IChat_Telegram {
  id: number;
  title?: string;
  type?: ChatType_Telegram | string;
  all_members_are_administrators?: boolean;
}

export interface User_Telegram {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name: string;
  username: string;
  language_code: string;
  is_premium?: boolean;
  added_to_attachment_menu?: boolean;
  can_join_groups?: boolean;
  can_read_all_group_messages?: boolean;
  supports_inline_queries?: boolean;
}

export interface Entity_Telegram {
  offset: number;
  length: number;
  type: EntityType_Telegram;
}

export interface ReplyMarkup_Telegram {
  inline_keyboard: Array<
    Array<{
      text: string;
      callback_data: string;
    }>
  >;
}

export interface PhotoSize_Telegram {
  file_id: string;
  file_unique_id: string;
  width: number;
  height: number;
  file_size: number;
}

export interface Video_Telegram {
  file_id: string;
  file_unique_id: string;
  width: number;
  height: number;
  file_size: number;
  mime_type: string;
}

export interface Message_Telegram {
  message_id: number;
  message_thread_id?: number;
  from: User_Telegram;
  sender_chat?: IChat_Telegram;
  chat: IChat_Telegram;
  date: number;
  text?: string;
  caption?: string;
  reply_to_message?: Message_Telegram;
  photo?: Array<PhotoSize_Telegram>;
  video?: Video_Telegram;
  entities?: Array<Entity_Telegram>;
  caption_entities?: Array<Entity_Telegram>;
  reply_markup?: ReplyMarkup_Telegram;
}

export interface Update_Telegram {
  update_id: number;
  message?: Message_Telegram;
  callback_query?: {
    id: string;
    from: User_Telegram;
    message: Message_Telegram;
    chat_instance: string;
    data: string;
  };
}

export interface ITelegramService {
  setWebhook(url: string): Promise<
    AxiosResponse<{
      ok: boolean;
      result: boolean;
      description: string;
    }>
  >;

  getWebhookInfo(): Promise<
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
  >;

  sendMessage(params: {
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
  }): Promise<AxiosResponse<any>>;

  editMessage(params: {
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
  }): Promise<AxiosResponse<any>>;

  sendPhoto(params: {
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
  }): Promise<AxiosResponse<any>>;

  sendVideo(params: {
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
  }): Promise<AxiosResponse<any>>;

  getChat(chatId: number | string): Promise<
    AxiosResponse<{
      ok: boolean;
      result: {
        id: number | string;
        title: string;
        username: string;
        type: string;
      };
    }>
  >;

  getChatMember(
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
  >;

  getMe(): Promise<
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
  >;

  editMessageReplyMarkup(params: {
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
  >;

  restrictChatMember(params: {
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
  }): Promise<AxiosResponse<{ ok: boolean; result: boolean }>>;

  deleteMessage(params: {
    chat_id: number | string;
    message_id?: number | string;
    message_ids?: Array<number | string>;
  }): Promise<AxiosResponse<{ ok: boolean; result: boolean }>>;
}

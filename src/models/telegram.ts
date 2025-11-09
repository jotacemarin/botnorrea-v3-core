export enum ChatType_Telegram {
  PRIVATE = "private",
  GROUP = "group",
  SUPERGROUP = "supergroup",
}

export enum EntityType_Telegram {
  BOT_COMMAND = "bot_command",
}

export enum FormattingOptions_Telegram {
  MARKDOWN_V2 = "MarkdownV2",
  HTML = "HTML",
  MARKDOWN = "Markdown",
}

export interface Chat_Telegram {
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
  sender_chat?: Chat_Telegram;
  chat: Chat_Telegram;
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

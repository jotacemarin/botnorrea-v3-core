import axios, { AxiosResponse, AxiosInstance } from "axios";
import {
  Entity_Telegram,
  User_Telegram,
  FormattingOptions_Telegram,
  Message_Telegram,
} from "../../models/telegram";

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

export class TelegramService {
  private static instance: AxiosInstance;

  private constructor() {}

  public static initInstance(botToken: string): void {
    if (!this.instance) {
      this.instance = axios.create({
        baseURL: `https://api.telegram.org/bot${botToken}`,
      });
    }
  }

  public static setWebhook(url: string): Promise<
    AxiosResponse<{
      ok: boolean;
      result: boolean;
      description: string;
    }>
  > {
    return TelegramService.instance.post("/setWebhook", { url });
  }

  public static getWebhookInfo(): Promise<
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
  > {
    return TelegramService.instance.get("/getWebhookInfo");
  }

  public static sendMessage(params: {
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
  }): Promise<AxiosResponse<SendMessageResponse_Telegram>> {
    return TelegramService.instance.post("/sendMessage", params);
  }

  public static editMessage(params: {
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
  }): Promise<AxiosResponse<SendMessageResponse_Telegram>> {
    return TelegramService.instance.post("/editMessageText", params);
  }

  public static sendPhoto(params: {
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
  }): Promise<AxiosResponse<SendMessageResponse_Telegram>> {
    return TelegramService.instance.post("/sendPhoto", params);
  }

  public static sendVideo(params: {
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
  }): Promise<AxiosResponse<SendMessageResponse_Telegram>> {
    return TelegramService.instance.post("/sendVideo", params);
  }

  public static getChat(chatId: number | string): Promise<
    AxiosResponse<{
      ok: boolean;
      result: {
        id: number | string;
        title: string;
        username: string;
        type: string;
      };
    }>
  > {
    return TelegramService.instance.get("/getChat", {
      params: { chat_id: chatId },
    });
  }

  public static getChatMember(
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
  > {
    return TelegramService.instance.get("/getChatMember", {
      params: { chat_id: chatId, user_id: userId },
    });
  }

  public static editMessageReplyMarkup(params: {
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
  > {
    return TelegramService.instance.post("/editMessageReplyMarkup", params);
  }

  public static async restrictChatMember(params: {
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
  }): Promise<AxiosResponse<{ ok: boolean; result: boolean }>> {
    return TelegramService.instance.post("/restrictChatMember", params);
  }

  public static deleteMessage(params: {
    chat_id: number | string;
    message_id?: number | string;
    message_ids?: Array<number | string>;
  }): Promise<
    AxiosResponse<{
      ok: boolean;
      result: boolean;
    }>
  > {
    return TelegramService.instance.post("/deleteMessage", params);
  }
}

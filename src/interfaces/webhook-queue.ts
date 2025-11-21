export interface WebhookQueueMessage {
  service: string;
  eventId: string;
}

export interface IWebhookQueueService {
  sendMessage(message: WebhookQueueMessage): Promise<void>;
}

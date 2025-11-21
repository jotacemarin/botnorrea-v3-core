import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { Resource } from "sst";
import { IWebhookQueueService, WebhookQueueMessage } from "../../interfaces";

const client = new SQSClient({});
const queueUrl = Resource.webhookQueue.url;

const sendMessage = async (
  message: WebhookQueueMessage,
  messageAttributes?: Record<string, { DataType: string; StringValue: string }>
): Promise<void> => {
  await client.send(
    new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(message),
      MessageAttributes: messageAttributes,
    })
  );
};

export const WebhookQueueService: IWebhookQueueService = {
  sendMessage,
};

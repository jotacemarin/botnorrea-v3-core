import { Context } from "hono";
import { ConsumerService } from "../../services/consumers";

const TELEGRAM_WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET ?? "";

export const verifyConsumer = async (
  username: string,
  password: string,
  c: Context
) => {
  const consumer = await ConsumerService.getById(username);
  if (consumer) {
    return consumer.apiKey === password;
  }

  return false;
};

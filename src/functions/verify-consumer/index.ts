import { Context } from "hono";
import { ConsumerService } from "../../services";

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

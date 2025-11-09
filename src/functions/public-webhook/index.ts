import { Context } from "hono";
import { status } from "http-status";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { sendMessageToTelegram } from "./telegram";

const SERVICES = {
  telegram: sendMessageToTelegram,
  whatsapp: (): { code: ContentfulStatusCode; result: { error: string } } => ({
    result: { error: "whatsapp service is not supported" },
    code: status.BAD_REQUEST,
  }),
  discord: () => ({
    result: { error: "discord service is not supported" },
    code: status.BAD_REQUEST,
  }),
};

export const publicWebhook = async (c: Context) => {
  const body = await c.req.json();

  if (!body?.service) {
    return c.json({ error: "service is missing" }, status.BAD_REQUEST);
  }

  const service = SERVICES[body.service as keyof typeof SERVICES];
  if (!service) {
    return c.json({ error: "service not found" }, status.BAD_REQUEST);
  }

  const response = await service(body, c);

  return c.json(response.result, response.code);
};

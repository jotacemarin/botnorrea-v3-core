import { Context } from "hono";
import status from "http-status";
import { TelegramService } from "../../services";

export const telegramSetWebhook = async (c: Context) => {
  const body = await c.req.json();
  if (!body?.url || body?.url?.trim() === "") {
    return c.json({ error: "url is missing" }, status.BAD_REQUEST);
  }

  const url = String(body.url).trim();

  const webhookOld = await TelegramService.getWebhookInfo();
  if (webhookOld?.data?.result?.url === url) {
    return c.json({ error: "Webhook already set" }, status.BAD_REQUEST);
  }

  await TelegramService.setWebhook(url);

  const response = {
    old: webhookOld?.data?.result?.url,
    new: url,
  };

  return c.json(response, status.OK);
};

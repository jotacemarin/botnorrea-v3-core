import { Context, Next } from "hono";
import { ConsumerService } from "../../services/consumers";
import status from "http-status";

const TELEGRAM_WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET ?? "";

export const verifyQuerySecret = async (c: Context, next: Next) => {
  const secret = String(c.req.query("secret"));
  const path = String(c.req.path);
  if (path.includes("telegram/webhook") && secret === TELEGRAM_WEBHOOK_SECRET) {
    await next();
    return;
  }

  return c.json({ error: "Unauthorized" }, status.UNAUTHORIZED);
};

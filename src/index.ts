import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { basicAuth } from "hono/basic-auth";
import { logger } from "hono/logger";
import {
  verifyConsumer,
  verifyQuerySecret,
  telegramWebhook,
  telegramSetWebhook,
  publicWebhook,
} from "./functions";

const app = new Hono();

app.use(logger());

const consumerMiddleware = basicAuth({ verifyUser: verifyConsumer });

app.post("/telegram/webhook", verifyQuerySecret, telegramWebhook);
app.post("/telegram/set-webhook", consumerMiddleware, telegramSetWebhook);
app.post("/public/webhook", consumerMiddleware, publicWebhook);

export const handler = handle(app);

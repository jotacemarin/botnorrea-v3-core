import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { basicAuth } from "hono/basic-auth";
import { logger } from "hono/logger";
import {
  verifyUser,
  telegramDebug,
  telegramWebhook,
  publicWebhook,
} from "./functions";

const app = new Hono();

app.use(logger());
app.use(basicAuth({ verifyUser }));

app.post("/telegram/webhook", telegramWebhook);
app.post("/telegram/debug", telegramDebug);
app.post("/public/webhook", publicWebhook);

export const handler = handle(app);

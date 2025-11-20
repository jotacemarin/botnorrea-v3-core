import { debug } from "./debug";
import { mute } from "./mute";
import { unmute } from "./unmute";

const BOT_USERNAME = process.env.BOT_USERNAME ?? "";

export const COMMANDS = {
  "/debug": debug,
  [`/debug@${BOT_USERNAME}`]: debug,
  "/mute": mute,
  [`/mute@${BOT_USERNAME}`]: mute,
  "/unmute": unmute,
  [`/unmute@${BOT_USERNAME}`]: unmute,
};

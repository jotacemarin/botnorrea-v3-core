import axios from "axios";
import { Update_Telegram } from "../../../../interfaces";
import { CommandService } from "../../../../services";
import { getCommandKey } from "../get-command-key";
import { debug } from "./debug";
import { mute } from "./mute";
import { unmute } from "./unmute";

const BOT_USERNAME = process.env.BOT_USERNAME ?? "";
const COMMANDS = {
  "/debug": debug,
  [`/debug@${BOT_USERNAME}`]: debug,
  "/mute": mute,
  [`/mute@${BOT_USERNAME}`]: mute,
  "/unmute": unmute,
  [`/unmute@${BOT_USERNAME}`]: unmute,
};

export const handler = async (body: Update_Telegram) => {
  const command = getCommandKey(body);
  console.log("command", command);
  if (!command) {
    return;
  }

  const localHandler = COMMANDS[command as keyof typeof COMMANDS];
  if (localHandler) {
    try {
      await localHandler(body);
    } catch (error) {
      console.error(`Error executing local command ${command}`, error);
    }
  }

  const externalCommand = await CommandService.getByKey(command);
  if (externalCommand && externalCommand?.url) {
    try {
      axios.post(externalCommand.url, {
        body,
      });
    } catch (error) {
      console.error(`Error executing external command ${command}`, error);
    }
  }

  return;
};

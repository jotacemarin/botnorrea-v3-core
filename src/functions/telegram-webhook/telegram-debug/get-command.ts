import {
  EntityType_Telegram,
  Update_Telegram,
} from "../../../interfaces/telegram";

const BOT_USERNAME = process.env.BOT_USERNAME ?? "";

const filterTextCommandEntity = ({
  type,
  offset,
}: {
  type: string;
  offset: number;
}) => type === EntityType_Telegram.BOT_COMMAND && offset === 0;

const checkIfHasTextCommand = (body: Update_Telegram) => {
  const entities = body?.message?.entities ?? [];
  const caption_entities = body?.message?.caption_entities ?? [];
  const commands = [...entities, ...caption_entities]?.filter(
    filterTextCommandEntity
  );
  return Boolean(commands?.length);
};

const getTextCommandPosition = (
  body: Update_Telegram
): { offset: number; length: number } => {
  const entities = body?.message?.entities ?? [];
  const caption_entities = body?.message?.caption_entities ?? [];
  const commands = [...entities, ...caption_entities]?.filter(
    filterTextCommandEntity
  );
  if (!commands?.length) {
    return { offset: 0, length: 0 };
  }

  const [{ offset, length }] = commands;
  return { offset, length };
};

const getTextCommandKey = (
  body: Update_Telegram,
  position: { offset: number; length: number }
): string => {
  const text = body?.message?.text ?? body?.message?.caption;
  const key = text!
    .substring(position?.offset, position?.length)
    .replace(`@${BOT_USERNAME}`, "");

  return key?.trim();
};

export const getCommand = (body: Update_Telegram): null | string => {
  const hasTextCommand = checkIfHasTextCommand(body);
  if (!hasTextCommand) {
    return null;
  }

  const position = getTextCommandPosition(body);
  const key = getTextCommandKey(body, position);
  if (!key) {
    return null;
  }

  if (key === "") {
    return null;
  }

  return key;
};

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  QueryCommand,
  DeleteCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { Resource } from "sst";
import { ICommand_Botnorrea, ICommandService } from "../../interfaces";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const tableName = Resource.commandsTable.name;

const create = async (
  command: ICommand_Botnorrea
): Promise<ICommand_Botnorrea> => {
  await docClient.send(
    new PutCommand({
      TableName: tableName,
      Item: command,
    })
  );
  return command;
};

const getByKey = async (key: string): Promise<ICommand_Botnorrea | null> => {
  const result = await docClient.send(
    new GetCommand({
      TableName: tableName,
      Key: { key },
    })
  );
  return (result.Item as ICommand_Botnorrea) ?? null;
};

const getAll = async (): Promise<ICommand_Botnorrea[]> => {
  const result = await docClient.send(
    new ScanCommand({
      TableName: tableName,
    })
  );

  return (result.Items as ICommand_Botnorrea[]) ?? [];
};

const getAllByCreator = async (
  creator: string
): Promise<ICommand_Botnorrea[]> => {
  const result = await docClient.send(
    new QueryCommand({
      TableName: tableName,
      IndexName: "creatorIndex",
      KeyConditionExpression: "#creator = :creator",
      ExpressionAttributeNames: {
        "#creator": "creator",
      },
      ExpressionAttributeValues: {
        ":creator": creator,
      },
    })
  );
  return (result.Items as ICommand_Botnorrea[]) ?? [];
};

const deleteByKey = async (key: string): Promise<boolean> => {
  await docClient.send(
    new DeleteCommand({
      TableName: tableName,
      Key: { key },
    })
  );
  return true;
};

const updateByKey = async (
  key: string,
  updates: Partial<Omit<ICommand_Botnorrea, "key">>
): Promise<ICommand_Botnorrea | null> => {
  const { key: _key, ...rest } = updates;

  const updateExpression: string[] = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, any> = {};

  Object.keys(rest).forEach((key, index) => {
    const attrName = `#attr${index}`;
    const attrValue = `:val${index}`;
    updateExpression.push(`${attrName} = ${attrValue}`);
    expressionAttributeNames[attrName] = key;
    expressionAttributeValues[attrValue] = rest[key as keyof typeof rest];
  });

  if (updateExpression.length === 0) {
    return getByKey(key);
  }

  await docClient.send(
    new UpdateCommand({
      TableName: tableName,
      Key: { key },
      UpdateExpression: `SET ${updateExpression.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    })
  );

  const command = await getByKey(key);
  return command ?? null;
};

export const CommandService: ICommandService = {
  create,
  getByKey,
  getAll,
  getAllByCreator,
  deleteByKey,
  updateByKey,
};

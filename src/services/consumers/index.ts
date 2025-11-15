import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { Resource } from "sst";
import {
  IConsumer_Botnorrea,
  IConsumerService,
} from "../../interfaces/consumer";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const tableName = Resource.clientsTable.name;

const create = async (
  consumer: IConsumer_Botnorrea
): Promise<IConsumer_Botnorrea> => {
  await docClient.send(
    new PutCommand({
      TableName: tableName,
      Item: consumer,
    })
  );
  return consumer;
};

const getById = async (id: string): Promise<IConsumer_Botnorrea | null> => {
  const result = await docClient.send(
    new GetCommand({
      TableName: tableName,
      Key: { id },
    })
  );
  return (result.Item as IConsumer_Botnorrea) || null;
};

const update = async (
  id: string,
  updates: Partial<Omit<IConsumer_Botnorrea, "id">>
): Promise<IConsumer_Botnorrea | null> => {
  const updateExpression: string[] = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, any> = {};

  Object.keys(updates).forEach((key, index) => {
    const attrName = `#attr${index}`;
    const attrValue = `:val${index}`;
    updateExpression.push(`${attrName} = ${attrValue}`);
    expressionAttributeNames[attrName] = key;
    expressionAttributeValues[attrValue] = updates[key as keyof typeof updates];
  });

  if (updateExpression.length === 0) {
    return getById(id);
  }

  const result = await docClient.send(
    new UpdateCommand({
      TableName: tableName,
      Key: { id },
      UpdateExpression: `SET ${updateExpression.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    })
  );

  return (result.Attributes as IConsumer_Botnorrea) || null;
};

const deleteById = async (id: string): Promise<boolean> => {
  await docClient.send(
    new DeleteCommand({
      TableName: tableName,
      Key: { id },
    })
  );
  return true;
};

const getAll = async (): Promise<IConsumer_Botnorrea[]> => {
  const result = await docClient.send(
    new ScanCommand({
      TableName: tableName,
    })
  );
  return (result.Items as IConsumer_Botnorrea[]) || [];
};

export const ConsumerService: IConsumerService = {
  getById,
  create,
  update,
  deleteById,
  getAll,
};

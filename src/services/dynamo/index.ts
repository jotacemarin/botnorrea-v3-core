import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

interface BaseItem {
  id: string;
  [key: string]: any;
}

const create = async <T extends BaseItem>(
  item: T,
  tableName: string
): Promise<T> => {
  await docClient.send(
    new PutCommand({
      TableName: tableName,
      Item: item,
    })
  );

  const result = await getById(item.id, tableName);
  if (!result) {
    throw new Error("Failed to create item");
  }

  return result as T;
};

const getById = async <T extends BaseItem>(
  id: string,
  tableName: string
): Promise<T | null> => {
  const result = await docClient.send(
    new GetCommand({
      TableName: tableName,
      Key: { id },
    })
  );
  return (result.Item as T) || null;
};

const update = async <T extends BaseItem>(
  id: string,
  updates: Partial<Omit<T, "id">>,
  tableName: string
): Promise<T | null> => {
  const updateExpressions: string[] = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, any> = {};

  Object.keys(updates).forEach((key, index) => {
    const value = updates[key as keyof typeof updates];
    if (value !== undefined) {
      const nameKey = `#attr${index}`;
      const valueKey = `:val${index}`;
      updateExpressions.push(`${nameKey} = ${valueKey}`);
      expressionAttributeNames[nameKey] = key;
      expressionAttributeValues[valueKey] = value;
    }
  });

  if (updateExpressions.length === 0) {
    return getById<T>(id, tableName);
  }

  const result = await docClient.send(
    new UpdateCommand({
      TableName: tableName,
      Key: { id },
      UpdateExpression: `SET ${updateExpressions.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    })
  );

  return (result.Attributes as T) || null;
};

const deleteById = async (id: string, tableName: string): Promise<boolean> => {
  const result = await docClient.send(
    new DeleteCommand({
      TableName: tableName,
      Key: { id },
      ReturnValues: "ALL_OLD",
    })
  );
  return !!result.Attributes;
};

const getAll = async <T extends BaseItem>(tableName: string): Promise<T[]> => {
  const result = await docClient.send(
    new ScanCommand({
      TableName: tableName,
    })
  );
  return (result.Items as T[]) || [];
};

export const DynamoService = {
  create,
  getById,
  update,
  deleteById,
  getAll,
};

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
import { IUser_Botnorrea, IUserService } from "../../interfaces/user";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const tableName = Resource.usersTable.name;

const getById = async (id: string): Promise<IUser_Botnorrea | null> => {
  const result = await docClient.send(
    new GetCommand({
      TableName: tableName,
      Key: { id },
    })
  );
  return (result.Item as IUser_Botnorrea) || null;
};

const create = async (user: IUser_Botnorrea): Promise<IUser_Botnorrea> => {
  await docClient.send(
    new PutCommand({
      TableName: tableName,
      Item: user,
    })
  );
  return user;
};

const update = async (
  id: string,
  updates: Omit<IUser_Botnorrea, "id">
): Promise<IUser_Botnorrea | null> => {
  const { id: _id, ...rest } = updates;

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
    return getById(id);
  }

  await docClient.send(
    new UpdateCommand({
      TableName: tableName,
      Key: { id },
      UpdateExpression: `SET ${updateExpression.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    })
  );

  const user = await getById(id);
  return user ?? null;
};

const save = async (user: IUser_Botnorrea): Promise<IUser_Botnorrea | null> => {
  const currentUser = await getById(user.id);
  if (currentUser) {
    return update(user.id, user);
  }

  return create(user);
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

const getAll = async (): Promise<IUser_Botnorrea[]> => {
  const result = await docClient.send(
    new ScanCommand({
      TableName: tableName,
    })
  );
  return (result.Items as IUser_Botnorrea[]) || [];
};

const getByUsername = async (
  username: string
): Promise<IUser_Botnorrea | null> => {
  const result = await docClient.send(
    new ScanCommand({
      TableName: tableName,
      FilterExpression: "username = :username",
      ExpressionAttributeValues: { ":username": username },
    })
  );

  if (!result.Items?.length) {
    return null;
  }

  return result.Items[0] as IUser_Botnorrea;
};

export const UserService: IUserService = {
  getById,
  save,
  deleteById,
  getAll,
  getByUsername,
};

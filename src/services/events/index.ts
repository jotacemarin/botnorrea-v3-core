import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { Resource } from "sst";
import { IEvent_Botnorrea, IEventService } from "../../interfaces/event";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const tableName = Resource.eventsTable.name;

const create = async (event: IEvent_Botnorrea): Promise<IEvent_Botnorrea> => {
  await docClient.send(
    new PutCommand({
      TableName: tableName,
      Item: event,
    })
  );
  return event;
};

const getById = async (id: string): Promise<IEvent_Botnorrea | null> => {
  const result = await docClient.send(
    new GetCommand({
      TableName: tableName,
      Key: { id },
    })
  );
  return (result.Item as IEvent_Botnorrea) || null;
};

const getAll = async (): Promise<IEvent_Botnorrea[]> => {
  const result = await docClient.send(
    new ScanCommand({
      TableName: tableName,
    })
  );
  return (result.Items as IEvent_Botnorrea[]) || [];
};

const queryByService = async (service: string): Promise<IEvent_Botnorrea[]> => {
  const result = await docClient.send(
    new QueryCommand({
      TableName: tableName,
      IndexName: "serviceIndex",
      KeyConditionExpression: "#service = :service",
      ExpressionAttributeNames: {
        "#service": "service",
      },
      ExpressionAttributeValues: {
        ":service": service,
      },
    })
  );
  return (result.Items as IEvent_Botnorrea[]) || [];
};

const queryByServiceAndEventId = async (
  service: string,
  eventId: string
): Promise<IEvent_Botnorrea[]> => {
  const result = await docClient.send(
    new QueryCommand({
      TableName: tableName,
      IndexName: "serviceEventIdIndex",
      KeyConditionExpression: "#service = :service AND #eventId = :eventId",
      ExpressionAttributeNames: {
        "#service": "service",
        "#eventId": "eventId",
      },
      ExpressionAttributeValues: {
        ":service": service,
        ":eventId": eventId,
      },
    })
  );
  return (result.Items as IEvent_Botnorrea[]) || [];
};

const queryByServiceAndFrom = async (
  service: string,
  from: string
): Promise<IEvent_Botnorrea[]> => {
  const result = await docClient.send(
    new QueryCommand({
      TableName: tableName,
      IndexName: "serviceFromIndex",
      KeyConditionExpression: "#service = :service AND #from = :from",
      ExpressionAttributeNames: {
        "#service": "service",
        "#from": "from",
      },
      ExpressionAttributeValues: {
        ":service": service,
        ":from": from,
      },
    })
  );
  return (result.Items as IEvent_Botnorrea[]) || [];
};

const queryByServiceAndDate = async (
  service: string,
  date: number
): Promise<IEvent_Botnorrea[]> => {
  const result = await docClient.send(
    new QueryCommand({
      TableName: tableName,
      IndexName: "serviceDateIndex",
      KeyConditionExpression: "#service = :service AND #date = :date",
      ExpressionAttributeNames: {
        "#service": "service",
        "#date": "date",
      },
      ExpressionAttributeValues: {
        ":service": service,
        ":date": date,
      },
    })
  );
  return (result.Items as IEvent_Botnorrea[]) || [];
};

export const EventService: IEventService = {
  getById,
  create,
  getAll,
  queryByService,
  queryByServiceAndEventId,
  queryByServiceAndFrom,
  queryByServiceAndDate,
};

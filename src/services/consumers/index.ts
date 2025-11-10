import { Resource } from "sst";
import { DynamoService } from "../dynamo";
import { Consumer_Botnorrea } from "../../models/consumer";

const create = async (
  consumer: Consumer_Botnorrea
): Promise<Consumer_Botnorrea> => {
  return DynamoService.create(consumer, Resource.clientsTable?.name);
};

const getById = async (id: string): Promise<Consumer_Botnorrea | null> => {
  return DynamoService.getById(id, Resource.clientsTable?.name);
};

const update = async (
  id: string,
  updates: Partial<Omit<Consumer_Botnorrea, "id">>
): Promise<Consumer_Botnorrea | null> => {
  return DynamoService.update(id, updates, Resource.clientsTable?.name);
};

const deleteById = async (id: string): Promise<boolean> => {
  return DynamoService.deleteById(id, Resource.clientsTable?.name);
};

const getAll = async (): Promise<Consumer_Botnorrea[]> => {
  return DynamoService.getAll(Resource.clientsTable?.name);
};

export const ConsumerService = {
  create,
  getById,
  update,
  deleteById,
  getAll,
};

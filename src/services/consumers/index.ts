import { Resource } from "sst";
import { DynamoService } from "../dynamo";
import { IStorageService } from "../../interfaces/storage";
import { IConsumer_Botnorrea } from "../../interfaces/consumer";

class ConsumerServiceClass {
  private storageService: IStorageService;
  private tableName: string;

  constructor(storageService: IStorageService, tableName?: string) {
    this.storageService = storageService;
    this.tableName = tableName || Resource.clientsTable?.name || "";
  }

  async create(consumer: IConsumer_Botnorrea): Promise<IConsumer_Botnorrea> {
    return this.storageService.create(consumer, this.tableName);
  }

  async getById(id: string): Promise<IConsumer_Botnorrea | null> {
    return this.storageService.getById<IConsumer_Botnorrea>(id, this.tableName);
  }

  async update(
    id: string,
    updates: Partial<Omit<IConsumer_Botnorrea, "id">>
  ): Promise<IConsumer_Botnorrea | null> {
    return this.storageService.update<IConsumer_Botnorrea>(
      id,
      updates,
      this.tableName
    );
  }

  async deleteById(id: string): Promise<boolean> {
    return this.storageService.deleteById(id, this.tableName);
  }

  async getAll(): Promise<IConsumer_Botnorrea[]> {
    return this.storageService.getAll<IConsumer_Botnorrea>(this.tableName);
  }
}

export const ConsumerService = new ConsumerServiceClass(
  DynamoService,
  Resource.clientsTable?.name
);

export { ConsumerServiceClass };

export interface IConsumer_Botnorrea {
  id: string;
  apiKey: string;
}

export interface IConsumerService {
  getById(id: string): Promise<IConsumer_Botnorrea | null>;
  create(consumer: IConsumer_Botnorrea): Promise<IConsumer_Botnorrea>;
  update(
    id: string,
    updates: Partial<Omit<IConsumer_Botnorrea, "id">>
  ): Promise<IConsumer_Botnorrea | null>;
  deleteById(id: string): Promise<boolean>;
  getAll(): Promise<IConsumer_Botnorrea[]>;
}

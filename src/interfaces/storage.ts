export interface IStorageService {
  create<T extends { id: string; [key: string]: any }>(
    item: T,
    tableName: string
  ): Promise<T>;

  getById<T extends { id: string; [key: string]: any }>(
    id: string,
    tableName: string
  ): Promise<T | null>;

  update<T extends { id: string; [key: string]: any }>(
    id: string,
    updates: Partial<Omit<T, "id">>,
    tableName: string
  ): Promise<T | null>;

  deleteById(id: string, tableName: string): Promise<boolean>;

  getAll<T extends { id: string; [key: string]: any }>(
    tableName: string
  ): Promise<T[]>;
}

export interface ICommand_Botnorrea {
  key: string;
  creator: string;
  url?: string;
  [key: string]: unknown;
}

export interface ICommandService {
  create(command: ICommand_Botnorrea): Promise<ICommand_Botnorrea>;
  getByKey(key: string): Promise<ICommand_Botnorrea | null>;
  getAll(): Promise<ICommand_Botnorrea[]>;
  getAllByCreator(creator: string): Promise<ICommand_Botnorrea[]>;
  deleteByKey(key: string): Promise<boolean>;
  updateByKey(
    key: string,
    updates: Partial<Omit<ICommand_Botnorrea, "key">>
  ): Promise<ICommand_Botnorrea | null>;
}

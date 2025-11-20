export interface IUser_Botnorrea {
  id: string;
  service: string;
  isBot: boolean;
  firstName: string;
  lastName: string;
  languageCode: string;
  username: string;
  [key: string]: unknown;
}

export interface IUserService {
  getById(id: string): Promise<IUser_Botnorrea | null>;
  save(user: IUser_Botnorrea): Promise<IUser_Botnorrea | null>;
  deleteById(id: string): Promise<boolean>;
  getAll(): Promise<IUser_Botnorrea[]>;
  getByUsername(username: string): Promise<IUser_Botnorrea | null>;
}

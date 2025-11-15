export interface IEvent_Botnorrea {
  id: string;
  service: string;
  eventId: string;
  from: string;
  date: number;
  text: string;
}

export interface IEventService {
  getById(id: string): Promise<IEvent_Botnorrea | null>;
  create(event: IEvent_Botnorrea): Promise<IEvent_Botnorrea>;
  update(
    id: string,
    updates: Partial<Omit<IEvent_Botnorrea, "id">>
  ): Promise<IEvent_Botnorrea | null>;
  deleteById(id: string): Promise<boolean>;
  getAll(): Promise<IEvent_Botnorrea[]>;
  queryByService(service: string): Promise<IEvent_Botnorrea[]>;
  queryByServiceAndEventId(
    service: string,
    eventId: string
  ): Promise<IEvent_Botnorrea[]>;
  queryByServiceAndFrom(
    service: string,
    from: string
  ): Promise<IEvent_Botnorrea[]>;
  queryByServiceAndDate(
    service: string,
    date: number
  ): Promise<IEvent_Botnorrea[]>;
}

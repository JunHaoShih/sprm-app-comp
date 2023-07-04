export enum SprmObjectType {
  None = 0,
  PartVersion = 1,
  PartUsage = 2,
  Routing = 3,
  RoutingVersion = 4,
  Process = 5,
  RoutingUsage = 6,
}

export interface ObjectType {
  id: SprmObjectType,
  number: string,
  name: string,
}

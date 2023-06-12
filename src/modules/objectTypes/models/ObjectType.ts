export enum ObjectTypeId {
  None = 0,
  PartVersion = 1,
  PartUsage = 2,
  Routing = 3,
  RoutingVersion = 4,
  Process = 5,
  RoutingProcess = 6,
}

export interface ObjectType {
  id: ObjectTypeId,
  number: string,
  name: string,
}

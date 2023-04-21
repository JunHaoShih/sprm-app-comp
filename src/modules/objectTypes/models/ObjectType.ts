export enum ObjectTypeId {
  None = 0,
  PartVersion = 1,
  Routing = 2,
  RoutingVersion = 3,
  Process = 4,
  RoutingProcess = 5,
}

export interface ObjectType {
  id: ObjectTypeId,
  number: string,
  name: string,
}

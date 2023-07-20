export enum SprmObjectType {
  None = 0,
  PartVersion = 1,
  PartUsage = 2,
  Routing = 3,
  RoutingVersion = 4,
  Process = 5,
  RoutingUsage = 6,
  CustomAttribute = 7,
  AttributeLink = 8,
  AppUser = 9,
}

export interface ObjectType {
  id: SprmObjectType,
  number: string,
  name: string,
}

export const objectTypeI18n: Record<SprmObjectType, string> = {
  0: 'errors.unknown',
  1: 'parts.version',
  2: 'parts.usage',
  3: 'parts.routing',
  4: 'parts.routings.version',
  5: 'processes.process',
  6: 'parts.routings.usage',
  7: 'customs.attributes.title',
  8: 'customs.attributeLinks.title',
  9: 'users.user',
};

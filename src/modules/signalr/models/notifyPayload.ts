export enum NotifyLevel {
  Unknown = 0,
  CommonNotify = 1,
  WarningNotify = 2,
  ErrorNotify = 3,
}

export enum NotifyType
{
  Unknown = 0,
  PermissionChanged = 1,
}

export interface NotifyPayload<T> {
  notifyLevel: NotifyLevel,
  notifyType: NotifyType,
  content: T,
}

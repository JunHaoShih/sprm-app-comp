import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { Notify } from 'quasar';
import { i18n } from 'src/boot/i18n';
import { NotifyLevel, NotifyPayload, NotifyType } from '../models/notifyPayload';

function getNotifyLevel(level: NotifyLevel) {
  switch (level) {
    case NotifyLevel.CommonNotify: {
      return 'info';
    }
    case NotifyLevel.WarningNotify: {
      return 'warning';
    }
    case NotifyLevel.ErrorNotify: {
      return 'error';
    }
    default: {
      return '';
    }
  }
}

function getTranslationByType(type: NotifyType) {
  switch (type) {
    case NotifyType.PermissionChanged: {
      return 'notifications.permissionChangedPleaseRefresh';
    }
    default: {
      return '';
    }
  }
}

export function signalrInit(accessToken: string): HubConnection {
  const logLevel = process.env.NODE_ENV === 'development'
    ? LogLevel.Information
    : LogLevel.None;

  const connection = new HubConnectionBuilder()
    .withUrl('/notifier', {
      accessTokenFactory: () => accessToken,
    })
    .configureLogging(logLevel)
    .withAutomaticReconnect()
    .build();

  connection.on('notify', (data: NotifyPayload<string>) => {
    const level = getNotifyLevel(data.notifyLevel);
    const messageKey = getTranslationByType(data.notifyType);
    Notify.create({
      type: level,
      message: i18n.global.t(messageKey),
      position: 'top',
      actions: [
        {
          icon: 'close',
          color: 'white',
          round: true,
          handler: () => { /* ... */ },
        },
      ],
    });
  });

  connection.on('error', (data: string) => {
    Notify.create({
      type: 'error',
      message: `${data}`,
      position: 'top',
      actions: [
        {
          icon: 'close',
          color: 'white',
          round: true,
          handler: () => { /* ... */ },
        },
      ],
    });
  });

  return connection;
}

import { Notify } from 'quasar';
import { i18n } from 'src/boot/i18n';

export function notifyErrorI18n(message: string) {
  Notify.create({
    message: i18n.global.t(message),
    color: 'red',
    icon: 'error',
  });
}

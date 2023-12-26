import { initializeApp, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { config } from 'dotenv';
import { FcmNotification } from 'src/types/notification.interface';
config();

const credential = cert(process.env.GOOGLE_APPLICATION_CREDENTIALS);

const app = initializeApp({ credential });
const messaging = getMessaging(app);

export const pushNotification = (message: FcmNotification) => {
  return messaging.sendMulticast(message);
};

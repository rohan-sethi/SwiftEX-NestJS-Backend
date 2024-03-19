import { FcmNotification } from 'src/types/notification.interface';
export declare const pushNotification: (message: FcmNotification) => Promise<import("firebase-admin/messaging").BatchResponse>;

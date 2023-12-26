import { BaseMessage, MulticastMessage } from 'firebase-admin/messaging';
import { NOTIFICATION_TYPES_ENUM } from 'src/utils/constants';

export type FcmNotificationData = {
  type: string;
  targetUser: string;

  /**
   * Note: empty string is equivalent to false & any other string is true.
   *    This is becuase FCM doesnt allow types other than 'string'
   */
  isActionRequired: string;
  message: string;
  offerId?: string;
  bidId?: string;
  transactionId?: string;
  transactionHash?: string;
  link?: string;
};
// const a:BaseMessage
export interface FcmNotification extends MulticastMessage {
  data: FcmNotificationData;
}

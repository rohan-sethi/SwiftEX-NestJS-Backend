import { MulticastMessage } from 'firebase-admin/messaging';
export declare type FcmNotificationData = {
    type: string;
    targetUser: string;
    isActionRequired: string;
    message: string;
    offerId?: string;
    bidId?: string;
    transactionId?: string;
    transactionHash?: string;
    link?: string;
};
export interface FcmNotification extends MulticastMessage {
    data: FcmNotificationData;
}

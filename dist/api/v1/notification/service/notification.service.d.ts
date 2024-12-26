export declare class NotificationService {
    private readonly logger;
    constructor();
    sendNotification(deviceToken: string, title: string, body: string, imageUrl?: string): Promise<void>;
}

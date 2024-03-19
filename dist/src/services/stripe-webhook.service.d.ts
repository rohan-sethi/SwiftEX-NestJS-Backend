import { UserDocument } from 'src/models/user.model';
import { Model } from 'mongoose';
export declare class StripeWebhookService {
    private userModel;
    private readonly logger;
    private server;
    private senderKeypair;
    constructor(userModel: Model<UserDocument>);
    private setupWebhook;
    sendPayment(recipientPublicKey: string): Promise<void>;
}

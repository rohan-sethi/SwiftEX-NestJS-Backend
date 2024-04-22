import { UserDocument } from 'src/models/user.model';
import { Model } from 'mongoose';
export declare class StripeWebhookService {
    private userModel;
    private server;
    private senderKeypair;
    constructor(userModel: Model<UserDocument>);
    payment_link(id: string, amount: number, XUSD_amount: string): Promise<any>;
    sendPayment(id: string, amount: string): Promise<void>;
    find_user(amount: any, email: any): Promise<void>;
}

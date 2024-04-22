import { Model } from 'mongoose';
import { UserDocument } from 'src/models/user.model';
import { StripeWebhookService } from 'src/services/stripe-webhook.service';
export declare class stripe_controller {
    private userModel;
    private readonly StripeWebhookService;
    constructor(userModel: Model<UserDocument>, StripeWebhookService: StripeWebhookService);
    payment_link(id: string, amount: number, XUSD_amount: string): Promise<any>;
    processPayment(mail: string, amount: string): Promise<void>;
}

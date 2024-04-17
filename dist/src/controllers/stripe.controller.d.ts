import { RawBodyRequest } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDocument } from 'src/models/user.model';
import { StripeWebhookService } from 'src/services/stripe-webhook.service';
export declare class stripe_controller {
    private userModel;
    private readonly StripeWebhookService;
    constructor(userModel: Model<UserDocument>, StripeWebhookService: StripeWebhookService);
    webhook(sig: any, request: RawBodyRequest<Request>, response: any): Promise<any>;
}

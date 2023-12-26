import { Model, ObjectId } from 'mongoose';
import { UserDocument } from 'src/models/user.model';
import { PayoutRepository } from 'src/repositories/payout.repository';
import Stripe from 'stripe';
export declare class PayoutServices {
    private userModel;
    private readonly payoutRepository;
    constructor(userModel: Model<UserDocument>, payoutRepository: PayoutRepository);
    createPayout(userId: ObjectId): void;
    getPayout(payoutId: string): void;
    getAccoutnPayouts(userId: ObjectId): Promise<Stripe.Payout[]>;
    handlePayoutFailureEvent(payoutObject: Stripe.Payout, stripeAccountId: string): Promise<void>;
    handlePayoutPaidEvent(payoutObject: Stripe.Payout, stripeAccountId: string): Promise<void>;
}

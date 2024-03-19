import Stripe from 'stripe';
export declare class PayoutRepository {
    stripe: Stripe;
    PAYOUT_ERROR: string;
    constructor();
    createPayout(stripeAccountId: any): Promise<{
        err: any;
    }>;
    getPayout(): void;
    getAccountPayouts(stripeAccount: string, stripePaginationParams: Stripe.PaginationParams): Stripe.ApiListPromise<Stripe.Payout>;
}

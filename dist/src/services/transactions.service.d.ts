/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Model, ObjectId } from 'mongoose';
import { OfferDocument } from 'src/models/offer.model';
import { Transaction } from 'src/models/transaction.model';
import { TransactionRepository } from 'src/repositories/transaction.repository';
import { Web3Services } from './web3.service';
import Stripe from 'stripe';
export declare class TransactionsService {
    private offerModel;
    private bidModel;
    private userModel;
    private readonly transactionRepository;
    private readonly web3Services;
    constructor(offerModel: Model<OfferDocument>, bidModel: Model<OfferDocument>, userModel: Model<OfferDocument>, transactionRepository: TransactionRepository, web3Services: Web3Services);
    getUserTansactions(userId: ObjectId): Promise<(import("mongoose").Document<unknown, any, Transaction> & Transaction & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>)[]>;
    getTxBySessionId(sessionId: any): Promise<import("mongoose").Document<unknown, any, Transaction> & Transaction & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>>;
    completeTx(session: Stripe.Checkout.Session): Promise<{
        message: string;
        succes?: undefined;
    } | {
        succes: boolean;
        message?: undefined;
    }>;
    updateFailedPaymentTx(session: any): Promise<void>;
    updateUserAccount(stripeAccount: any): Promise<{
        success: boolean;
    }>;
}

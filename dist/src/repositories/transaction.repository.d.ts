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
import { Model } from 'mongoose';
import { Bid } from 'src/models/bid.model';
import { Offer } from 'src/models/offer.model';
import { Transaction, TransactionDocument } from 'src/models/transaction.model';
import { User, UserDocument } from 'src/models/user.model';
import { TxFeeRepository } from './txFees.repository';
import { ChainServices } from 'src/services/web3.service';
export declare class TransactionRepository {
    private transactionModel;
    private userModel;
    private readonly txFeeRepository;
    private readonly chainServices;
    constructor(transactionModel: Model<TransactionDocument>, userModel: Model<UserDocument>, txFeeRepository: TxFeeRepository, chainServices: ChainServices);
    createTx(offer: Offer, bid: Bid, bidder: User): Promise<import("mongoose").Document<unknown, any, Transaction> & Transaction & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>>;
    findTx(query: any): Promise<(import("mongoose").Document<unknown, any, Transaction> & Transaction & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>)[]>;
    findOneTx(query: any): Promise<import("mongoose").Document<unknown, any, Transaction> & Transaction & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>>;
    updateOneTx(query: any, update: any): Promise<import("mongoose").Document<unknown, any, Transaction> & Transaction & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>>;
    private calculatePrice;
}

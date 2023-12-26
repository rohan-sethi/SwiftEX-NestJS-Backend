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
import { NewBidDto } from 'src/dtos/newBid.dto';
import { UpdateBidDto } from 'src/dtos/updateBid.dto';
import { Bid, BidDocument } from 'src/models/bid.model';
import { OfferDocument } from 'src/models/offer.model';
import { UserDocument } from 'src/models/user.model';
import { TransactionRepository } from 'src/repositories/transaction.repository';
export declare class BidsService {
    private userModel;
    private bidModel;
    private offerModel;
    private readonly transactionRepository;
    constructor(userModel: Model<UserDocument>, bidModel: Model<BidDocument>, offerModel: Model<OfferDocument>, transactionRepository: TransactionRepository);
    getAllBids(userId: ObjectId): import("mongoose").Aggregate<any[]>;
    addNewBid(newBid: NewBidDto, userId: ObjectId): Promise<{
        success: boolean;
    }>;
    updateBidPrice(userId: ObjectId, bidId: ObjectId, update: UpdateBidDto): Promise<{
        success: boolean;
    }>;
    cancelBid(userId: ObjectId, bidId: ObjectId): Promise<string>;
    getBidDetails(bidId: ObjectId, userId: ObjectId): Promise<(import("mongoose").Document<unknown, any, Bid> & Bid & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>)[]>;
    getInSyncedBids(userId: ObjectId, fcmRegToken: string): Promise<(import("mongoose").Document<unknown, any, Bid> & Bid & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>)[]>;
    syncDevice(userId: ObjectId, fcmRegToken: string): Promise<{
        success: boolean;
        acknowledged: boolean;
        matchedCount: number;
        modifiedCount: number;
        upsertedCount: number;
        upsertedId: import("bson").ObjectID;
    }>;
}

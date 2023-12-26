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
import { ObjectId } from 'mongoose';
import { BidSyncBodyDto } from 'src/dtos/bidSyncBody.dto';
import { NewBidDto } from 'src/dtos/newBid.dto';
import { UpdateBidDto } from 'src/dtos/updateBid.dto';
import { BidsService } from 'src/services/bids.service';
export declare class BidsController {
    private readonly BidsService;
    constructor(BidsService: BidsService);
    getAllBids(userId: ObjectId): import("mongoose").Aggregate<any[]>;
    addNewBid(newBid: NewBidDto, userId: ObjectId): Promise<{
        success: boolean;
    }>;
    updateBidPrice(bidId: ObjectId, userId: ObjectId, update: UpdateBidDto): Promise<{
        success: boolean;
    }>;
    cancelBid(bidId: ObjectId, userId: ObjectId): Promise<string>;
    getBidDetails(bidId: ObjectId, userId: ObjectId): Promise<(import("mongoose").Document<unknown, any, import("../models/bid.model").Bid> & import("../models/bid.model").Bid & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>)[]>;
    getInSyncedBids(fcmRegToken: string, userId: ObjectId): Promise<(import("mongoose").Document<unknown, any, import("../models/bid.model").Bid> & import("../models/bid.model").Bid & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>)[]>;
    syncDevice(userId: ObjectId, bidSyncBody: BidSyncBodyDto): Promise<{
        success: boolean;
        acknowledged: boolean;
        matchedCount: number;
        modifiedCount: number;
        upsertedCount: number;
        upsertedId: import("bson").ObjectID;
    }>;
}

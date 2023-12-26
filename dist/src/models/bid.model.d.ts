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
import { HydratedDocument, ObjectId } from 'mongoose';
export declare type BidDocument = HydratedDocument<Bid>;
export declare class Bid {
    _id: ObjectId;
    pricePerUnit: number;
    bidder: ObjectId;
    offer: ObjectId;
    status?: string;
    acceptanceTx?: ObjectId;
    fcmRegTokens: string[];
    currencyName: string;
}
export declare const BidSchema: import("mongoose").Schema<Bid, import("mongoose").Model<Bid, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Bid>;

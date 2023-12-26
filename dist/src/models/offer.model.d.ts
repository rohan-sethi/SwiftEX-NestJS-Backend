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
export declare type OfferDocument = HydratedDocument<Offer>;
export declare class Offer {
    _id: ObjectId;
    amount: number;
    assetName: string;
    pricePerUnit: number;
    issuer: ObjectId;
    bids?: Array<ObjectId>;
    winnerBid?: ObjectId;
    totalPrice: number;
    appFee: number;
    currencyName: string;
    chainName: string;
    chainId: number;
    failureReason?: string;
    blockchainTxHash: string;
    status: string;
}
export declare const OfferSchema: import("mongoose").Schema<Offer, import("mongoose").Model<Offer, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Offer>;

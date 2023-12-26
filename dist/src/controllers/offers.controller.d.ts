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
import { AcceptABidDto } from 'src/dtos/acceptABid.dto';
import { NewOfferDto } from 'src/dtos/newOffer.dto';
import { OfferUpdateDto } from 'src/dtos/offerUpdate.dto';
import { OffersService } from '../services/offers.service';
export declare class OffersController {
    private readonly OffersService;
    constructor(OffersService: OffersService);
    getAllOffers(): import("mongoose").Query<(import("mongoose").Document<unknown, any, import("../models/offer.model").Offer> & import("../models/offer.model").Offer & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>)[], import("mongoose").Document<unknown, any, import("../models/offer.model").Offer> & import("../models/offer.model").Offer & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, any, import("../models/offer.model").Offer> & import("../models/offer.model").Offer & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>>;
    addNewOffer(newOffer: NewOfferDto, userId: ObjectId): Promise<import("mongoose").Document<unknown, any, import("../models/offer.model").Offer> & import("../models/offer.model").Offer & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>>;
    updateOffer(offerId: ObjectId, update: OfferUpdateDto, userId: ObjectId): Promise<import("mongoose").Document<unknown, any, import("../models/offer.model").Offer> & import("../models/offer.model").Offer & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>>;
    cancelOffer(offerId: ObjectId, userId: ObjectId): Promise<{
        sentTx: any;
    }>;
    getOfferDetails(offerId: ObjectId, userId: ObjectId): Promise<{
        offerBids: any[];
        pricePerUnit: number;
        currencyName: string;
        _id: import("mongoose").Schema.Types.ObjectId;
        status: string;
        amount: number;
        assetName: string;
        issuer: import("mongoose").Schema.Types.ObjectId;
        bids?: import("mongoose").LeanDocument<import("mongoose").Schema.Types.ObjectId>[];
        winnerBid?: import("mongoose").Schema.Types.ObjectId;
        totalPrice: number;
        appFee: number;
        chainName: string;
        chainId: number;
        failureReason?: string;
        blockchainTxHash: string;
    }>;
    acceptABid(body: AcceptABidDto, userId: ObjectId): Promise<{
        success: boolean;
    }>;
    cancelMatchedBid(offerId: ObjectId, userId: ObjectId): Promise<void>;
}

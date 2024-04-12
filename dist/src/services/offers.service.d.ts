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
import { NewOfferDto } from 'src/dtos/newOffer.dto';
import { OfferUpdateDto } from 'src/dtos/offerUpdate.dto';
import { BidDocument } from 'src/models/bid.model';
import { Offer, OfferDocument } from 'src/models/offer.model';
import { UserDocument } from 'src/models/user.model';
import { TransactionRepository } from 'src/repositories/transaction.repository';
import { ChainServices, Web3Services } from './web3.service';
export declare class OffersService {
    private userModel;
    private offerModel;
    private bidModel;
    private readonly transactionRepository;
    private readonly web3Services;
    private readonly chainServices;
    constructor(userModel: Model<UserDocument>, offerModel: Model<OfferDocument>, bidModel: Model<BidDocument>, transactionRepository: TransactionRepository, web3Services: Web3Services, chainServices: ChainServices);
    getAllOffers(): import("mongoose").Query<(import("mongoose").Document<unknown, any, Offer> & Offer & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>)[], import("mongoose").Document<unknown, any, Offer> & Offer & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, any, Offer> & Offer & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>>;
    addNewOffer(newOffer: NewOfferDto, userId: ObjectId): Promise<import("mongoose").Document<unknown, any, Offer> & Offer & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>>;
    updateOffer(userId: ObjectId, offerId: ObjectId, update: OfferUpdateDto): Promise<import("mongoose").Document<unknown, any, Offer> & Offer & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>>;
    cancelOffer(userId: ObjectId, offerId: ObjectId): Promise<{
        sentTx: any;
    }>;
    getOfferDetails(offerId: ObjectId, userId: ObjectId): Promise<{
        offerBids: any[];
        _id: import("mongoose").Schema.Types.ObjectId;
        amount: number;
        assetName: string;
        pricePerUnit: number;
        issuer: import("mongoose").Schema.Types.ObjectId;
        bids?: import("mongoose").LeanDocument<import("mongoose").Schema.Types.ObjectId>[];
        winnerBid?: import("mongoose").Schema.Types.ObjectId;
        totalPrice: number;
        appFee: number;
        currencyName: string;
        chainName: string;
        chainId: number;
        failureReason?: string;
        blockchainTxHash: string;
        status: string;
    }>;
    acceptABid(userId: ObjectId, bidId: ObjectId, offerId: ObjectId): Promise<{
        success: boolean;
    }>;
    cancelMatchedBid(userId: ObjectId, offerId: ObjectId): Promise<void>;
}

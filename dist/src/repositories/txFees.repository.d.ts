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
import { TxFee, TxFeeDocument } from 'src/models/txFees.model';
import { ChainServices, Web3Services } from 'src/services/web3.service';
export declare class TxFeeRepository {
    private readonly txFeeModel;
    private readonly web3Services;
    private readonly chainServices;
    constructor(txFeeModel: Model<TxFeeDocument>, web3Services: Web3Services, chainServices: ChainServices);
    getTxFeePrice(txName: string, chainId: number): Promise<import("mongoose").Document<unknown, any, TxFee> & TxFee & Required<{
        _id: string;
    }>>;
    createTxFeePrice(): Promise<void>;
    updateTxFeePrice(): Promise<void>;
}

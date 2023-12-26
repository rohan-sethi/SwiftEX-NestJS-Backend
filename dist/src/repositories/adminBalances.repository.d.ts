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
import { AdminBalances, AdminBalancesDocument } from 'src/models/adminBalances.model';
import { AdminWalletsService } from 'src/services/adminWallets.service';
export declare class AdminBalancesRepository {
    private adminBalancesModel;
    private readonly adminWalletsService;
    constructor(adminBalancesModel: Model<AdminBalancesDocument>, adminWalletsService: AdminWalletsService);
    private createAdminBalances;
    updateAdminBalances(): Promise<void>;
    getAdminBalancesByAddress(address: string): Promise<import("mongoose").Document<unknown, any, AdminBalances> & AdminBalances & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>>;
    getAdminBalanceByAsset(assetName: string, chainId: number): Promise<{
        address: any;
        balance: any;
        assetName: any;
    }[]>;
}

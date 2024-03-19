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
import { RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';
import { TransactionsService } from 'src/services/transactions.service';
import { ObjectId } from 'mongoose';
import { PayoutServices } from 'src/services/payout.services';
export declare class TransactionsController {
    private readonly transactionsService;
    private readonly payoutServices;
    constructor(transactionsService: TransactionsService, payoutServices: PayoutServices);
    transactionDetails(sessionId: string): Promise<import("mongoose").Document<unknown, any, import("../models/transaction.model").Transaction> & import("../models/transaction.model").Transaction & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>>;
    webhook(sig: any, request: RawBodyRequest<Request>, response: any): Promise<any>;
    connectWebhook(sig: any, request: RawBodyRequest<Request>, response: any): Promise<any>;
    getUserTansactions(userId: ObjectId): Promise<(import("mongoose").Document<unknown, any, import("../models/transaction.model").Transaction> & import("../models/transaction.model").Transaction & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>)[]>;
}

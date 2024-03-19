import { OnModuleInit } from '@nestjs/common';
import { UserDocument } from 'src/models/user.model';
import { Model } from 'mongoose';
export declare class Payout_listion implements OnModuleInit {
    private userModel;
    private readonly logger;
    constructor(userModel: Model<UserDocument>);
    onModuleInit(): void;
    listenForTransactions(): void;
    check(get_email: any, get_amount: any): Promise<void>;
    sendMoneyToBank(receiverAccountId: string, amount: number, currency: string): Promise<any>;
    listenForTransactionsXETH(): void;
    check_(get_email: any, get_amount: any): Promise<void>;
}

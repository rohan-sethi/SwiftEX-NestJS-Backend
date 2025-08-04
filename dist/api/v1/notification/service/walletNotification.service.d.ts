/// <reference types="node" />
import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from '../../user/schema/user.schema';
export declare class WalletNotificationService implements OnModuleInit {
    private userModel;
    private readonly logger;
    constructor(userModel: Model<User>);
    onModuleInit(): Promise<void>;
    addWalletWatcher(apiInfo: any, stellarWalletAddress: string, userData: any): Promise<any>;
    addWalletToMoralis(walletAddress: string, userDetils: any): Promise<any>;
    getSecretKey(): Promise<Buffer>;
    encryptMessageToString(payload: any): Promise<string>;
}

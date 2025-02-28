import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from '../user/schema/user.schema';
export declare class ContractTransactionListener implements OnModuleInit {
    private userModel;
    private readonly logger;
    private provider;
    private contract;
    private contractAddress;
    private readonly StellarRpc;
    private server;
    private contractABI;
    constructor(userModel: Model<User>);
    onModuleInit(): void;
    private listenToEvents;
    findUserByWallet(sender: string, amount: string): Promise<any>;
    sendXLM(destinationPublic: string, amount: string): Promise<any>;
}

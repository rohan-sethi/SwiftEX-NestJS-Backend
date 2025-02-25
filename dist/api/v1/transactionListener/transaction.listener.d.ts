import { OnModuleInit } from '@nestjs/common';
export declare class ContractTransactionListener implements OnModuleInit {
    private readonly logger;
    private provider;
    private contract;
    private contractAddress;
    private contractABI;
    constructor();
    onModuleInit(): void;
    private listenToEvents;
}

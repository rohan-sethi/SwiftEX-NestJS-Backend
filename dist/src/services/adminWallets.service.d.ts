import { AdminBalancesRepository } from 'src/repositories/adminBalances.repository';
import { Balance } from 'src/models/adminBalances.model';
import { AwsServices } from './aws.service';
import { ChainServices } from './web3.service';
export declare class AdminWalletsService {
    private readonly adminBalancesRepository;
    private readonly chainServices;
    private readonly awsServices;
    private adminAddresses;
    constructor(adminBalancesRepository: AdminBalancesRepository, chainServices: ChainServices, awsServices: AwsServices);
    updateAdminWallet: () => Promise<void>;
    getAdminAddresses: () => Array<string>;
    getAssetsBalances: (adminAddress: string) => Promise<Array<Balance>>;
    getRandomAdminWallet: () => string;
    isAnAdminAccount: (address: string) => boolean;
}

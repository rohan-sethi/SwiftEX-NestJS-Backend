import { AdminBalancesRepository } from 'src/repositories/adminBalances.repository';
import { TxFeeRepository } from 'src/repositories/txFees.repository';
import { AdminWalletsService } from './adminWallets.service';
import { MarketDataService } from './market-data.service';
export declare class TasksService {
    private readonly adminBalancesRepository;
    private readonly txFeeRepository;
    private readonly adminWalletsService;
    private readonly market_crypto;
    constructor(adminBalancesRepository: AdminBalancesRepository, txFeeRepository: TxFeeRepository, adminWalletsService: AdminWalletsService, market_crypto: MarketDataService);
    updateAddminWalletBalance(): void;
    updateTxPrice(): void;
    udpateAdminWallets(): void;
    updateMarketdata(): void;
}

import { AdminBalancesRepository } from 'src/repositories/adminBalances.repository';
import { TxFeeRepository } from 'src/repositories/txFees.repository';
import { AdminWalletsService } from './adminWallets.service';
export declare class TasksService {
    private readonly adminBalancesRepository;
    private readonly txFeeRepository;
    private readonly adminWalletsService;
    constructor(adminBalancesRepository: AdminBalancesRepository, txFeeRepository: TxFeeRepository, adminWalletsService: AdminWalletsService);
    updateAddminWalletBalance(): void;
    updateTxPrice(): void;
    udpateAdminWallets(): void;
}

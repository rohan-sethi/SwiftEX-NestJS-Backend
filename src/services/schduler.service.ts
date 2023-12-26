import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AdminBalancesRepository } from 'src/repositories/adminBalances.repository';
import { TxFeeRepository } from 'src/repositories/txFees.repository';
import { AdminWalletsService } from './adminWallets.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly adminBalancesRepository: AdminBalancesRepository,
    private readonly txFeeRepository: TxFeeRepository,
    private readonly adminWalletsService: AdminWalletsService,
  ) {}

  /// Update admin wallet addresses every 10 minutes
  @Cron(CronExpression.EVERY_10_MINUTES)
  updateAddminWalletBalance() {
    this.adminBalancesRepository.updateAdminBalances();
  }

  /// Update transaction price every one minute
  @Cron('0/10 * * * * *')
  updateTxPrice() {
    this.txFeeRepository.updateTxFeePrice();
  }

  /// Update admin wallets every day
  @Cron('0 0 0 * * *')
  udpateAdminWallets() {
    this.adminWalletsService.updateAdminWallet();
  }
}

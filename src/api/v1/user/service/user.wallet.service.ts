import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserWallet, WalletStatus } from '../schema/user.wallets.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class UserWalletService {
    private readonly logger = new Logger(UserWalletService.name);
    constructor(
        @InjectModel(UserWallet.name) private userWallet: Model<UserWallet>,
    ) { }

    async updateAddressWithUser(
        userObjId: any,
        newAddress: { multichainAddress: string; stellarAddress: string }
    ): Promise<UserWallet> {
        try {
            const walletInfo = await this.userWallet.findOne({ userId: new Types.ObjectId(userObjId) }).exec();

            if (!walletInfo) {
                // User doesn't exist → Create new
                const newUser = new this.userWallet({
                    userId: userObjId,
                    allWalletAddress: [
                        {
                            multichainAddress: newAddress.multichainAddress,
                            multichainStatus: WalletStatus.ACTIVE,
                            stellarAddress: newAddress.stellarAddress,
                            stellarStatus: WalletStatus.ACTIVE,
                        },
                    ],
                });
                return newUser.save();
            }

            // User exists → Update statuses and push new address
            // Step 1: Inactivate all previous active statuses
            for (const addr of walletInfo.allWalletAddress) {
                if (addr.multichainStatus === WalletStatus.ACTIVE) addr.multichainStatus = WalletStatus.INACTIVE;
                if (addr.stellarStatus === WalletStatus.ACTIVE) addr.stellarStatus = WalletStatus.INACTIVE;
            }

            // Step 2: Add new address as active
            walletInfo.allWalletAddress.push({
                multichainAddress: newAddress.multichainAddress,
                multichainStatus: WalletStatus.ACTIVE,
                stellarAddress: newAddress.stellarAddress,
                stellarStatus: WalletStatus.ACTIVE,
            });

            return walletInfo.save();
        } catch (error) {
            this.logger.log('walletAddress Error: ', error);
            throw new Error('Error while saving user walletAddress.');
        }
    }
}
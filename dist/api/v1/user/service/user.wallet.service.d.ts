import { UserWallet } from '../schema/user.wallets.schema';
import { Model } from 'mongoose';
export declare class UserWalletService {
    private userWallet;
    private readonly logger;
    constructor(userWallet: Model<UserWallet>);
    updateAddressWithUser(userObjId: any, newAddress: {
        multichainAddress: string;
        stellarAddress: string;
    }): Promise<UserWallet>;
}

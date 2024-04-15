import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId, ObjectId } from 'mongoose';
import { NewUserDto } from 'src/dtos/newUser.dto';
import { UserLoginDto } from 'src/dtos/userLogin.dto';
import { User, UserDocument } from 'src/models/user.model';
import { signJwtToken } from 'src/utils/jwtHandler';
import bcrypt from 'bcrypt';
import Stripe from 'stripe';
import { sendMessage } from 'src/utils/msgHandler';
import { phoneOtpDto } from 'src/dtos/phoneOtp.dto';
import { RedisService } from 'src/utils/redisHandler';
import { VerifyEmailDto } from 'src/dtos/verifyEmail.dto';
import { Redis } from 'ioredis';
import { EmailService } from 'src/utils/emailHandler';
import { NewStripeAccountDto } from 'src/dtos/newStripeAccount.dto';
import { AdminWalletsService } from './adminWallets.service';
import { TxFeeRepository } from 'src/repositories/txFees.repository';
import { ChainServices } from './web3.service';
import * as Stellar from 'stellar-sdk';
import { ethers } from 'ethers';
import { contractABI } from './ABI';

const stripe = new Stripe(process.env.STRIPE_API_SK, {
  apiVersion: '2022-11-15',
});

@Injectable()
export class UsersService {
  private readonly redisClient: Redis;
  private readonly logger = new Logger(UsersService.name);
  private server: Stellar.Server;
  private senderKeypair: Stellar.Keypair;


  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly redisService: RedisService,
    private readonly emailService: EmailService,
    private readonly adminWalletsService: AdminWalletsService,
    private readonly txFeeRepository: TxFeeRepository,
    private readonly chainServices: ChainServices,
  
    ) {
      this.server = new Stellar.Server('https://horizon-testnet.stellar.org');
      this.senderKeypair = Stellar.Keypair.fromSecret('SB2IR7WZS3EDS2YEJGC3POI56E5CESRZPUVN72DWHTS4AACW5OYZXDTZ');
      this.redisClient = redisService.getClient();
     Stellar.Network.useTestNetwork();
  }

  getAllUsers() {
    return this.userModel.find();
  }

// Register new User
// async register(newUser: NewUserDto) {
//   console.log("===-=-=-=-=-=-=")
//   const userExist = await this.userModel.findOne({
//     phoneNumber: newUser.phoneNumber,
//   });
//   if (userExist)
//     throw new HttpException(
//       'Email already registered',
//       HttpStatus.BAD_REQUEST,
//     );

//   if (newUser.email) {
//     const emailExist = await this.userModel.findOne({ email: newUser.email });
//     if (emailExist)
//       throw new HttpException(
//         'Email already registered',
//         HttpStatus.BAD_REQUEST,
//       );
//   }

//   const otp = this._generateOtp();
//   // const { errorMessage } = await sendMessage({
//   //   body: `Hi ${newUser.firstName} ${newUser.lastName},\nWelcome to crypto-exchange! your OTP is: ${otp}`,
//   //   from: process.env.TWILIO_PHN_NO,
//   //   to: newUser.phoneNumber,
//   // });

//   // if (errorMessage)
//   //   throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);

// try{
//   console.log("-=-=-=-=-=",newUser)
//   const loginOtp = bcrypt.hashSync(otp, 10);
//   const addedUser = await this.userModel.create({ ...newUser, loginOtp });

//   const { errorMessage, errorCode } = await await this.emailService.sendEmail(
//     newUser.email,
//     'One Time Passcode from SwiftEx.',
//     `Hi ${newUser.firstName},\nYour email from SwiftEx verification OTP is ${otp}\nRegards,`,
//   );
  
//   if (errorMessage)
//   throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);

  

//   return addedUser;
// }catch(err)
// {
//   console.log(err)
// }
// }

  // Register new User
  // async register(newUser: NewUserDto) {
  //   const userExist = await this.userModel.findOne({
  //     phoneNumber: newUser.phoneNumber,
  //   });
  //   if (userExist)
  //     throw new HttpException(
  //       'Phone No. already registered',
  //       HttpStatus.BAD_REQUEST,
  //     );

  //   if (newUser.email) {
  //     const emailExist = await this.userModel.findOne({ email: newUser.email });
  //     if (emailExist)
  //       throw new HttpException(
  //         'Email already registered',
  //         HttpStatus.BAD_REQUEST,
  //       );
  //   }

  //   const otp = this._generateOtp();
  //   const { errorMessage } = await this.emailService.sendEmail(
  //     newUser.email,
  //     'One Time Passcode from SwiftEx.',
  //     `Hi ${newUser.firstName},\nYour email from SwiftEx verification OTP is ${otp}\nRegards,`,
  //   );

  //   if(errorMessage==="Otp Send successfully")
  //   {
  //     const loginOtp = bcrypt.hashSync(otp, 10);
  //     const addedUser = await this.userModel.create({ ...newUser, loginOtp });

  //     console.log("=================000000",addedUser)
  //     return addedUser;
  //   }
  //   if (errorMessage)
  //     throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);

  // }



  async register(newUser: NewUserDto) {
    const userExist = await this.userModel.findOne({
      phoneNumber: newUser.phoneNumber,
    });
    if (userExist)
      throw new HttpException(
        'Email already registered',
        HttpStatus.BAD_REQUEST,
      );
      const wallet_exist = await this.userModel.findOne({ walletAddress: newUser.walletAddress });
      if(wallet_exist)
      throw new HttpException(
        'Wallet already registered',
        HttpStatus.BAD_REQUEST,
      );
    if (newUser.email) {
      const emailExist = await this.userModel.findOne({ email: newUser.email });
      if (emailExist)
        throw new HttpException(
          'Email already registered',
          HttpStatus.BAD_REQUEST,
        );
    }
    const otp = this._generateOtp();
    const loginOtp = bcrypt.hashSync(otp, 10);
    const addedUser = await this.userModel.create({ ...newUser, loginOtp });
     if(!addedUser){
      throw new HttpException({errorMessage:"not created"}, HttpStatus.BAD_REQUEST);
     }else{
      const { errorMessage } = await this.emailService.sendEmail(
        newUser.email,
        'One Time Passcode from SwiftEx.',
        `Hi ${newUser.firstName},\nYour email from SwiftEx verification OTP is ${otp}\nRegards,`,
      );
      if (errorMessage)
        throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
     }
    return addedUser;
  }








  // Get user Details
  getUserDetails(userId) {
    return this.userModel.findById(userId).select('-passcode');
  }

  // Apply for KYC
  async userKycApply(userId) {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    await this.userModel.updateOne({ _id: userId }, { isVerified: true });
    return 'success';
  }

  // Login
  // async login(credintails: UserLoginDto) {
  //   console.log("called")
  //   const { phoneNumber } = credintails;
  //   const user = await this.userModel.findOne({ phoneNumber });
  //   if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    // const { loginOtpUpdatedAt } = user;
    // const otpLockTime = 30000 - (new Date().getTime() - loginOtpUpdatedAt);
    // if (otpLockTime >= 0)
    //   throw new HttpException(
    //     `Cannot generate login OTP in next ${Math.floor(
    //       otpLockTime / 1000,
    //     )} sec.`,
    //     HttpStatus.BAD_REQUEST,
    //   );
    // const otp = this._generateOtp();
    // console.log(">>",otp)

    // const { errorMessage, errorCode } = await sendMessage({
    //   body: `Hi ${user.firstName} ${user.lastName},\nYour crypto-exhange login OTP is: ${otp} /oxBn3sK95AK`,
    //   from: process.env.TWILIO_PHN_NO,
    //   to: user.phoneNumber,
    // });

    // if (errorMessage)
    //   throw new HttpException(errorMessage, errorCode);

    // const loginOtp = bcrypt.hashSync(otp, 10);
    // await this.userModel.findOneAndUpdate(
    //   { phoneNumber },
    //   {
    //     loginOtp,
    //     loginOtpUpdatedAt: new Date().getTime(),
    //     isLoginOtpUsed: false,
    //   },
    // );
    // return user;
  // }




  //  async login_email(credintails: UserLoginDto) {
  //   try{
  //     console.log("called")
  //   const { email } = credintails;
  //   const user = await this.userModel.findOne({ email });
  //   if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

  //   const newOtp = this._generateOtp();
  //   await this.emailService.sendEmail(
  //     email,
  //     'One Time Passcode from SwiftEx.',
  //     `Hi ${user.firstName},\nYour email verification OTP is ${newOtp}\nRegards,`,
  //   );
  //   return { success: true, message: 'Otp Send successfully' };
  //   }catch(err)
  //   {
  //     throw new HttpException('Failed to send email', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }


  ////////////////////////////////////////////////////////


  //  async login_email(credintails: UserLoginDto) {
  //   const { email } = credintails;
  //   const user = await this.userModel.findOne({ email });
  //   if (!user) throw new HttpException({errorMessage:'User not found'}, HttpStatus.NOT_FOUND);

  //   const { loginOtpUpdatedAt } = user;
  //   const otpLockTime = 30000 - (new Date().getTime() - loginOtpUpdatedAt);
  //   if (otpLockTime >= 0)
  //     throw new HttpException(
  //       `Cannot generate login OTP in next ${Math.floor(
  //         otpLockTime / 1000,
  //       )} sec.`,
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   const otp = this._generateOtp();
  //   const { errorMessage, errorCode } = await await this.emailService.sendEmail(
  //         email,
  //         'One Time Passcode from SwiftEx.',
  //          `Hi ${user.firstName},\nYour email from SwiftEx for verification OTP is ${otp}\nRegards,`,
  //       );
  //       const loginOtp = bcrypt.hashSync(otp, 10);
  //       await this.userModel.findOneAndUpdate(
  //         { email },
  //         {
  //           loginOtp,
  //           loginOtpUpdatedAt: new Date().getTime(),
  //           isLoginOtpUsed: false,
  //         },
  //       );
        
  //   if (errorMessage)
  //     throw new HttpException(errorMessage, errorCode);
  //   return user;
  // }

  async forgot_email(credintails: UserLoginDto) {
    const { email } = credintails;
    const user = await this.userModel.findOne({ email });
    if (!user) throw new HttpException({errorMessage:'User not found'}, HttpStatus.NOT_FOUND);

    const { loginOtpUpdatedAt } = user;
    const otpLockTime = 30000 - (new Date().getTime() - loginOtpUpdatedAt);
    if (otpLockTime >= 0)
      throw new HttpException(
        `Cannot generate login OTP in next ${Math.floor(
          otpLockTime / 1000,
        )} sec.`,
        HttpStatus.BAD_REQUEST,
      );
    const otp = this._generateOtp();
    const { errorMessage, errorCode } = await await this.emailService.sendEmail(
          email,
          'One Time Passcode from SwiftEx.',
           `Hi ${user.firstName},\nYour email from SwiftEx for Recover Account verification OTP is ${otp}\nRegards,`,
        );
        const loginOtp = bcrypt.hashSync(otp, 10);
        await this.userModel.findOneAndUpdate(
          { email },
          {
            loginOtp,
            loginOtpUpdatedAt: new Date().getTime(),
            isLoginOtpUsed: false,
          },
        );
        
    if (errorMessage)
      throw new HttpException(errorMessage, errorCode);
    return user;
  }

  async verifyLoginOtp(phoneOtp: phoneOtpDto) {
    const { email, otp } = phoneOtp;
    const user = await this.userModel.findOne({ email });
    if (!user)
      throw new HttpException('Invalid credintials', HttpStatus.BAD_REQUEST);
    if (user.isLoginOtpUsed)
      throw new HttpException(
        'New OTP generation required',
        HttpStatus.BAD_REQUEST,
      );
    if (!bcrypt.compareSync(otp, user.loginOtp))
      throw new HttpException('Wrong OTP', HttpStatus.BAD_REQUEST);
    const token = signJwtToken({
      phoneNumber: user.phoneNumber,
      _id: user._id,
    });
    await this.userModel.findOneAndUpdate(
      { email },
      { isLoginOtpUsed: true },
    );

    return { token };
  }

  // Stripe Account
  // async createStripeAccount(
  //   userId: ObjectId,
  //   accountBody: NewStripeAccountDto,
  // ) {
  //   const user = await this.userModel.findOne({ _id: userId });
  //   if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

  //   const stripe = new Stripe(process.env.STRIPE_API_SK, {
  //     apiVersion: '2022-11-15',
  //   });

  //   if (user.stripeAccountId) {
  //     throw new HttpException(
  //       'Already have a bank account',
  //       HttpStatus.BAD_REQUEST,
  //     );

  //     // // Bellow give the ERROR: "400: You cannot add cards or bank accounts for payouts and top-ups away from the dashboard."
  //     // const externalAccountToken = await stripe.tokens.create({
  //     //   bank_account: accountBody,
  //     // });
  //     // await stripe.accounts.createExternalAccount(user.stripeAccountId, {
  //     //   external_account: externalAccountToken.id,
  //     // });
  //   }

  //   const accountDefaults = {
  //     object: 'bank_account',
  //     account_holder_name: `${user.firstName} ${user.lastName}`,
  //     account_holder_type: 'individual',
  //   };

  //   const newAccount = await stripe.accounts.create({
  //     type: 'standard',
  //     country: accountBody.country,
  //     default_currency: accountBody.currency,
  //     external_account: { ...accountBody, ...accountDefaults },
  //     email: user.email,
  //   });
  //   await this.userModel.findByIdAndUpdate(userId, {
  //     stripeAccountId: newAccount.id,
  //   });

  //   return { success: true, message: 'Bank account added successfully' };
  // }


  async createStripeAccount(
    userId: ObjectId,
    accountBody: NewStripeAccountDto,
  ) {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const stripe = new Stripe(process.env.STRIPE_API_SK, {
      apiVersion: '2022-11-15',
    });

    if (user.stripeAccountId) {
      throw new HttpException(
        'Already have a bank account',
        HttpStatus.BAD_REQUEST,
      );

      // // Bellow give the ERROR: "400: You cannot add cards or bank accounts for payouts and top-ups away from the dashboard."
      // const externalAccountToken = await stripe.tokens.create({
      //   bank_account: accountBody,
      // });
      // await stripe.accounts.createExternalAccount(user.stripeAccountId, {
      //   external_account: externalAccountToken.id,
      // });
    }

    const accountDefaults = {
      object: 'bank_account',
      account_holder_name: `${user.firstName} ${user.lastName}`,
      account_holder_type: 'individual',
    };

    const newAccount = await stripe.accounts.create({
      type: 'standard',
      country: accountBody.country,
      default_currency: accountBody.currency,
      external_account: { ...accountBody, ...accountDefaults },
      email: user.email,
    });
    await this.userModel.findByIdAndUpdate(userId, {
      stripeAccountId: newAccount.id,
    });

    return { success: true, message: 'Bank account added successfully' };
  }


  async getStripeAccount(userId: ObjectId) {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    if (!user.stripeAccountId) return null;

    const stripe = new Stripe(process.env.STRIPE_API_SK, {
      apiVersion: '2022-11-15',
    });

    const account = await stripe.accounts.retrieve(user.stripeAccountId);
    return account;
  }

  // Stripe Balances
  async getStripeBalances(userId: ObjectId) {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    if (!user.stripeAccountId) return null;

    const stripe = new Stripe(process.env.STRIPE_API_SK, {
      apiVersion: '2022-11-15',
    });

    const balances = await stripe.balance.retrieve({
      stripeAccount: user.stripeAccountId,
    });

    return balances;
  }

  // Email verifcation
  async updateEmail(userId: ObjectId, newEmail: string) {
    const userByEmail = await this.userModel.findOne({ email: newEmail });
    if (userByEmail && userByEmail._id.toString() !== userId.toString())
      throw new HttpException('Email already in use', HttpStatus.BAD_REQUEST);

    const user: User = await this.userModel.findById(userId);
    if (user.email === newEmail) return { success: true };

    await this.userModel.findByIdAndUpdate(userId, {
      email: newEmail,
      isEmailVerified: false,
    });
    return { success: true };
  }

  async verifyUserEmail(userId: ObjectId, emailBody: VerifyEmailDto) {
    const { email, otp } = emailBody;
    const user: User = await this.userModel.findById(userId);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    if (user.email !== email)
      throw new HttpException(
        'Not your rigistered email',
        HttpStatus.UNAUTHORIZED,
      );
    if (user.isEmailVerified)
      throw new HttpException('Email already verified', HttpStatus.BAD_REQUEST);

    // OTP verification
    if (otp) {
      const cachedOtp = await this.redisClient.get(email);
      const isVerified = cachedOtp === otp;
      isVerified &&
        (await this.userModel.findByIdAndUpdate(userId, {
          isEmailVerified: true,
        }));
      return { isVerified };
    }

    // Sending OTP
    const newOtp = this._generateOtp();
    await this.emailService.sendEmail(
      email,
      'Email Verification',
      `Hi ${user.firstName},\nYour email verification OTP is ${newOtp}\nRegards,`,
    );
    await this.redisClient.set(email, newOtp, 'EX', 300);

    return { otpSent: true };
  }

  // User Syncing
  async getInSynced(userId: ObjectId, fcmRegToken: string) {
    const inSyncedUser = await this.userModel.findOne({
      _id: userId,
      fcmRegTokens: { $ne: fcmRegToken },
    });

    return inSyncedUser ? { isInSynced: true } : { isInSynced: false };
  }

  async syncDevice(userId: ObjectId, fcmRegToken: string) {
    const synced = await this.userModel.updateOne(
      {
        _id: userId,
        fcmRegTokens: { $ne: fcmRegToken },
      },
      {
        $push: { fcmRegTokens: fcmRegToken },
      },
    );

    return { ...synced, success: true };
  }

  // Admin wallet
  getAdminWallet() {
    return {
      adminWalletAddress: this.adminWalletsService.getRandomAdminWallet(),
    };
  }

  // Transaction fee
  async getTxFeeData(assetName: string, chainId: number) {
    if (!this.chainServices.isChainListed(chainId))
      throw new HttpException(
        `${chainId} chain ID is not listed`,
        HttpStatus.BAD_REQUEST,
      );

    if (!this.chainServices.isAssetListed(assetName))
      throw new HttpException(
        `${assetName} asset is not listed`,
        HttpStatus.BAD_REQUEST,
      );

    const txName = this.chainServices.getAssetsTxName(assetName);
    const feeData = await this.txFeeRepository.getTxFeePrice(txName, chainId);
    if (!feeData)
      throw new HttpException(
        'Transaction name not found',
        HttpStatus.NOT_FOUND,
      );

    return feeData;
  }

  // Helpers
  private _generateOtp() {
    const otp = Math.floor(
      Math.random() * (999999 - 100000) + 100000,
    ).toString();
    console.log('New Otp:', otp); // test...
    return otp;
  }


  async findByEmailAndUpdatePublicKey(email: string, newPublicKey: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.userModel.findByIdAndUpdate(user._id, {
      public_key: newPublicKey,
    })

    const server = new Stellar.Server('https://horizon-testnet.stellar.org');
   const res =  server.friendbot(newPublicKey)
  .call()
  .then(() => {
    this.logger.log('Funded successfully');
    return { success: true, message: "Funded successfully" };
  })
  .catch(() => {
    this.logger.log('Error funding account:');
    return { success: false , message: "Error funding account"};
  });
  return res;
  }
  
  async findByEmailAndupdataPasscode(email: string, Passcode: string) {
    try {
      const user = await this.userModel.findOne({ email });

      if (!user) {
        return { success: false, message: "user not found", status: "404" };
      }
      const newPasscode = bcrypt.hashSync(Passcode, 10);
      const res = await this.userModel.findByIdAndUpdate(user._id, {
        passcode: newPasscode,
      })
      if (!res) {
        return { success: false, message: "fail to add", status: "500" };
      }
      return { success: true, message: "Added", status: "200" };

    } catch (error) {
      return { success: false, status: "500" };
    }
  }

  async login_email(phoneOtp: phoneOtpDto) {
    const { email, otp } = phoneOtp;
    const user = await this.userModel.findOne({ email });
    if (!user)
      throw new HttpException('Invalid credintials', HttpStatus.BAD_REQUEST);
    if (!bcrypt.compareSync(otp, user.passcode))
      throw new HttpException('Worng User Data', HttpStatus.BAD_REQUEST);
    const token = signJwtToken({
      phoneNumber: user.phoneNumber,
      _id: user._id,
    });
    await this.userModel.findOneAndUpdate(
      { email },
      { isLoginOtpUsed: true },
    );

    return { token };
  }
// for XETH

// async sendXETH(email:string,amount:string): Promise<void> {
//   try {
//       const emailExist = await this.userModel.findOne({ email: email });
//       if (emailExist === null) {
//           throw new HttpException(`${email} is not listed`,HttpStatus.BAD_REQUEST,);
//       }
//     else{
//        if(!emailExist.public_key)
//        {
//         throw new HttpException(`Publick Key is not listed`,HttpStatus.BAD_REQUEST,);
//        }else{
        // const recipientPublicKey=emailExist.public_key;
        // const server = new Stellar.Server('https://horizon-testnet.stellar.org');
        // const senderSecretKey = 'SB2IR7WZS3EDS2YEJGC3POI56E5CESRZPUVN72DWHTS4AACW5OYZXDTZ';
        // const issuingAccountPublicKey = 'GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI';
        
        // const senderKeypair = Stellar.Keypair.fromSecret(senderSecretKey);
      
        //   try {
        //     const account = await server.loadAccount(senderKeypair.publicKey());
        
        //     const XETHAsset = new Stellar.Asset('XETH', issuingAccountPublicKey);
        
        //     const transaction = new Stellar.TransactionBuilder(account, {
        //       fee: Stellar.BASE_FEE,
        //       networkPassphrase: Stellar.Networks.TESTNET,
        //     })
        //       .addOperation(
        //         Stellar.Operation.payment({
        //           destination: recipientPublicKey,
        //           asset: XETHAsset,
        //           amount: amount,
        //         })
        //       )
        //       .setTimeout(30)
        //       .build();
        
        //     transaction.sign(senderKeypair);
        
        //     const transactionResult = await server.submitTransaction(transaction);
        //     // console.log('Transaction Successful:', transactionResult);
        //     console.log('Transaction Successful to : ',recipientPublicKey);
        //     throw new HttpException({message:"true",res:transactionResult}, HttpStatus.ACCEPTED);

        //   } catch (error) {
        //     console.error('Error making payment:', error);
        //     throw new HttpException({message:"false",res:error}, HttpStatus.BAD_REQUEST);
        //   }
//        }
//   }
// }
// catch(err){
//   console.error(err)
//   throw new HttpException({message:"false",res:err}, HttpStatus.BAD_REQUEST);
// }
// }

async sendXETH(email:string,amount:string): Promise<void> {
      const emailExist = await this.userModel.findOne({ email: email });
      if (!emailExist) {
          throw new NotFoundException(`${email} is not listed`);
      }
      if(!emailExist.public_key)
      {
        throw new NotFoundException(` public key is not listed`);
      }
      const recipientPublicKey=emailExist.public_key;
      const server = new Stellar.Server('https://horizon-testnet.stellar.org');
      const senderSecretKey = 'SB2IR7WZS3EDS2YEJGC3POI56E5CESRZPUVN72DWHTS4AACW5OYZXDTZ';
      const issuingAccountPublicKey = 'GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI';
      
      const senderKeypair = Stellar.Keypair.fromSecret(senderSecretKey);
          const account = await server.loadAccount(senderKeypair.publicKey());
      
          const XETHAsset = new Stellar.Asset('XETH', issuingAccountPublicKey);
      
          const transaction = new Stellar.TransactionBuilder(account, {
            fee: Stellar.BASE_FEE,
            networkPassphrase: Stellar.Networks.TESTNET,
          })
            .addOperation(
              Stellar.Operation.payment({
                destination: recipientPublicKey,
                asset: XETHAsset,
                amount: amount,
              })
            )
            .setTimeout(30)
            .build();
      
          transaction.sign(senderKeypair);
      
          const transactionResult = await server.submitTransaction(transaction);
          // console.log('Transaction Successful:', transactionResult);
          console.log('Transaction Successful to : ',recipientPublicKey);
          throw new HttpException({message:"true",res:transactionResult}, HttpStatus.ACCEPTED);
       
      
}
 
async XETH_Payout(email:string,amount:string): Promise<void>{
  const emailExist = await this.userModel.findOne({ email: email });
  if (!emailExist) {
      throw new NotFoundException(`${email} is not listed`);
  }
  if(!emailExist.walletAddress)
  {
    throw new NotFoundException(` Ether public key is not listed`);
  }
  if(!amount)
  {
    throw new NotFoundException(`Amount require.`);
  }
  else{
    // const recipientPublicKey=emailExist.walletAddress;
    // throw new HttpException({message:"true",res:recipientPublicKey}, HttpStatus.ACCEPTED);
    
  //  const result=await this.payout_xeth(amount);
  //  throw new HttpException({res:result}, HttpStatus.ACCEPTED);

  }
}

  //  async payout_xeth(amountToTransfer)
  //  {
  //   const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_RPC);
  //   const privateKey = '9d9e1e7a8fdb0ed51a40a4c6b3e32c91f64615e37281150932fa1011d1a59daf';
  //   const contractAddress = process.env.SMART_CONTRACT; 
  //   const contract = new ethers.Contract(contractAddress, contractABI, provider);
  //   const wallet = new ethers.Wallet(privateKey, provider);
  //   const connectedContract = contract.connect(wallet);
  //   const gasLimit = 300000;
  //   try {
  //     const tx = await connectedContract.payout(amountToTransfer, { gasLimit });
  //     const receipt = await tx.wait();
  //     return receipt ;
  //    } catch (error) {
  //     console.error('Error sending payout:', error);
  //     return error;
  //   }
  //  }


  // async payout_xeth(amountToTransfer)
  //  {
  //   const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_RPC);
  //   const privateKey = '0xd4787fFaa142c62280732afF7899B3AB03Ea0eAA';
  //   const contractAddress = process.env.SMART_CONTRACT; 
  //   const contract = new ethers.Contract(contractAddress, contractABI, provider);
  //   const wallet = new ethers.Wallet(privateKey, provider);
  //   const connectedContract= new ethers.Contract(contractAddress, contractABI, wallet);
  //   // const connectedContract = contract.connect(wallet);
  //   const gasLimit = 300000;
  //   try {
  //     const tx = await connectedContract.payout(amountToTransfer, { gasLimit });
  //     const receipt = await tx.wait();
  //     return receipt ;
  //    } catch (error) {
  //     console.error('Error sending payout:', error);
  //     return error;
  //   }
  //  }

}
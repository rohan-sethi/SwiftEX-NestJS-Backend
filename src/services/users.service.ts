import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
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


const stripe = new Stripe(process.env.STRIPE_API_SK, {
  apiVersion: '2022-11-15',
});

@Injectable()
export class UsersService {
  private readonly redisClient: Redis;
  private readonly logger = new Logger(UsersService.name);



  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly redisService: RedisService,
    private readonly emailService: EmailService,
    private readonly adminWalletsService: AdminWalletsService,
    private readonly txFeeRepository: TxFeeRepository,
    private readonly chainServices: ChainServices,
  
    ) {
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
  async register(newUser: NewUserDto) {
    const userExist = await this.userModel.findOne({
      phoneNumber: newUser.phoneNumber,
    });
    if (userExist)
      throw new HttpException(
        'Phone No. already registered',
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
    const { errorMessage } = await this.emailService.sendEmail(
      newUser.email,
      'One Time Passcode from SwiftEx.',
      `Hi ${newUser.firstName},\nYour email from SwiftEx verification OTP is ${otp}\nRegards,`,
    );

    if(errorMessage==="true")
    {
      const loginOtp = bcrypt.hashSync(otp, 10);
      const addedUser = await this.userModel.create({ ...newUser, loginOtp });
      return addedUser;
    }
    if (errorMessage)
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);

  }








  // Get user Details
  getUserDetails(userId) {
    return this.userModel.findById(userId);
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
    // const { email } = credintails;
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


   async login_email(credintails: UserLoginDto) {
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
           `Hi ${user.firstName},\nYour email from SwiftEx for verification OTP is ${otp}\nRegards,`,
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

}

import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User } from '../schema/user.schema';
import { CreateGuestUserDto, CreateUserDto, PasscodeDTO, VerifyEmailDto } from '../dto/create-user.dto';
import { OtpDto, UpdateUserDto } from '../dto/update-user.dto';
import { EmailService } from '../../utils/email.service';
import { LoginJwtToken, signJwtToken } from '../../auth/jwt.utils';
import * as bcrypt from 'bcrypt';
import * as Stellar from 'stellar-sdk';
import { UserForgetDto } from '../../auth/dto/auth-credentials.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { NotificationService } from '../../notification/service/notification.service';


@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(@InjectModel(User.name) private userModel: Model<User>,
    private readonly emailService: EmailService,
    private readonly mailerService: MailerService,
    private readonly notificationService: NotificationService,
  ) {
    Stellar.Network.useTestNetwork();
  }

  async guestRegister(CreateGuestUserDto: CreateGuestUserDto) {
    try {
      // Check if user with the same device unique ID exists
      const userExist = await this.userModel.findOne({ email:CreateGuestUserDto.deviceUniqueID })
      // const userExist = await this.userModel.findOne({ "DeviceInfo": { "deviceUniqueID": CreateGuestUserDto.deviceUniqueID } })
      if (userExist) {
        // Generate a JWT token for the updated user
        const payload = { email: userExist.email, sub: userExist._id };
        const token = LoginJwtToken(payload);
        return { success: true, message: "Guest user alredy exist", status: 200, token };
      }
      const gusetUserInfo = {
        firstName: "Guest",
        lastName: "guest",
        phoneNumber: CreateGuestUserDto?.deviceUniqueID,
        email: CreateGuestUserDto?.deviceUniqueID,
        accountAddress: CreateGuestUserDto?.deviceUniqueID,
        walletAddress: CreateGuestUserDto?.deviceUniqueID,
        password: "null",
        loginOtp: "null",
        DeviceInfo: CreateGuestUserDto
      }
      const guestUser = await this.userModel.create(gusetUserInfo);
      if (!guestUser) {
        return { success: false, message: "somthig went wrong", status: 400, error: "null" };
      }
      // Generate a JWT token for the updated user
      const payload = { email: guestUser.email, sub: guestUser._id };
      const token = LoginJwtToken(payload);
      return { success: true, message: "Guest user created", status: 200, token };

    } catch (error) {
      return { success: false, message: "Internal server error", status: 500, error: error.message };
    }
  }

  async register(CreateUserDto: CreateUserDto) {
    // Check if user with the same phone number exists
    const userExist = await this.userModel.findOne({ phoneNumber: CreateUserDto.phoneNumber });
    if (userExist)
      throw new HttpException('Phone number already registered', HttpStatus.BAD_REQUEST);

    // Check if user with the same wallet address exists
    const walletExist = await this.userModel.findOne({ walletAddress: CreateUserDto.walletAddress });
    // Uncomment this if you want to throw an error if the wallet address is already taken
    // if (walletExist) 
    //   throw new HttpException('Wallet address already registered', HttpStatus.BAD_REQUEST);

    // Check if user with the same email exists
    if (CreateUserDto.email) {
      const emailExist = await this.userModel.findOne({ email: CreateUserDto.email });
      if (emailExist)
        throw new HttpException('Email already registered', HttpStatus.BAD_REQUEST);
    }

    // Generate OTP
    const otp = this._generateOtp();
    const loginOtp = bcrypt.hashSync(otp, 10);

    // Send OTP via email (Assuming emailService is implemented)
    const { errorCode, errorMessage } = await this.emailService.sendEmail(CreateUserDto.email, CreateUserDto.firstName, otp);
    if (errorCode === 500) {
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }

    // Create the user in the database
    const addedUser = await this.userModel.create({ ...CreateUserDto, loginOtp });
    if (!addedUser) {
      throw new HttpException('User creation failed', HttpStatus.BAD_REQUEST);
    }

    // Generate JWT Token
    const token = signJwtToken({
      phoneNumber: addedUser.phoneNumber,
      _id: addedUser._id,
    });

    return { token, message: 'OTP sent successfully' };
  }

  // Helper function to generate OTP
  private _generateOtp(): string {
    // Generate a 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
  }


  async forgotEmail(credintails: UserForgetDto) {
    const { email } = credintails;
    const user = await this.userModel.findOne({ email:email.toLocaleLowerCase() });
    if (!user)
    {
      throw new HttpException({errorMessage:'User not found'}, HttpStatus.NOT_FOUND);
    }

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
      const { errorCode, errorMessage } = await this.emailService.sendEmail(
        email,
        user.firstName,
        otp
      );
        const loginOtp = bcrypt.hashSync(otp, 10);
        await this.userModel.findOneAndUpdate(
          { _id:user._id },
          {
            loginOtp:loginOtp,
            loginOtpUpdatedAt: new Date().getTime(),
            isLoginOtpUsed: false,
          },
        );
        
        if (errorCode===500)
        {
          throw new HttpException(errorMessage, errorCode);
        }
        if (errorCode===200)
        {
          const token = signJwtToken({
            phoneNumber: user.phoneNumber,
            _id: user._id,
          });
          const data={
            errorCode,
            errorMessage,
            token
          }
          throw new HttpException(data, errorCode);
        }
    return user;
  }

  async verifyLoginOtp(userId: ObjectId, phoneOtp: OtpDto) {
    const { otp } = phoneOtp;
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) {
      throw new HttpException('Invalid credintials', HttpStatus.BAD_REQUEST);
    }
    if (user.isLoginOtpUsed) {
      throw new HttpException(
        'New OTP generation required',
         HttpStatus.BAD_REQUEST,
         );
    }
    if (!bcrypt.compareSync(otp, user.loginOtp)) {
      throw new HttpException('Wrong OTP', HttpStatus.BAD_REQUEST);
    }
    const token = signJwtToken({
      phoneNumber: user.phoneNumber,
      _id: user._id,
    });
    await this.userModel.findOneAndUpdate(
      { _id: userId },
      { 
        isLoginOtpUsed: true,
        loginOtp: ""
      }
    );
    return { token };
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

    // Sending OTP
    const newOtp = this._generateOtp();
    await this.emailService.sendEmail(
      email,
      user.firstName,
      newOtp
    );

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





  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  async findOneById(id: string): Promise<User | null> {
    return await this.userModel.findById(id).select('-passcode');
  }

  async findAndUpdatePublicKey(id: string, newPublicKey,newWalletPublicKey) {
  try {
    const user = await this.userModel.findById(id);

    if (!user) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        // if (user.public_key) {
        //   throw new HttpException({ success: false, message: "Error funding account", status_code: HttpStatus.CONFLICT, funded_key: user.public_key }, HttpStatus.CONFLICT);
        // }
    await this.userModel.findByIdAndUpdate(user._id, {
      public_key: newPublicKey,
      walletAddress:newWalletPublicKey
    })

    const server = new Stellar.Server(process.env.RPC_STELLAR);
    const sourceSecretKey = process.env.ACTIVATE_STELLAR_ADDRESS //ACTIVATION_SOURCE_ACCOUNT_SECRET_KEY
    const sourceKeypair = Stellar.Keypair.fromSecret(sourceSecretKey);

    const destinationPublicKey = newPublicKey;

    const asset = new Stellar.Asset("USDC", process.env.STELLAR_ONETAP_ISSUER);
    const account = await server.loadAccount(sourceKeypair.publicKey())
        const transaction = new Stellar.TransactionBuilder(account, {
          fee: Stellar.BASE_FEE,
          networkPassphrase: Stellar.Networks.TESTNET
        })
          .addOperation(Stellar.Operation.createAccount({
            destination: destinationPublicKey,
            startingBalance: '5'
          }))
          .addOperation(
            Stellar.Operation.changeTrust({
              asset: asset,
              limit: "1000",
              source: destinationPublicKey,
            })
          )
          .setTimeout(180)
          .build();

        transaction.sign(sourceKeypair);
        const xdr = transaction.toEnvelope().toXDR("base64");
        // const res = server.submitTransaction(transaction);
        await this.notificationService.sendNotification(
          user.fcmRegTokens[0],
          'Activate',
          'Congratulations! 5 XLM has been successfully added to your wallet.'
        );
        this.logger.log('Success! Result:');
        return { success: true, message: "Funded successfully",resXdr:xdr, status_code: HttpStatus.ACCEPTED };
      }catch(error) {
        this.logger.log('Error funding account:', error);
        return { success: false, message: "Error funding account", status_code: HttpStatus.EXPECTATION_FAILED };
      }
    }
    

  async UpdatePublicKey(id: string, newPublicKey,newWalletPublicKey) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const res=await this.userModel.findByIdAndUpdate(user._id, {
      public_key: newPublicKey,
      walletAddress:newWalletPublicKey
    })
    if(!res){
      return { success: false, message: "keys updates faild", status_code: HttpStatus.BAD_REQUEST };
    }
    return { success: true, message: "keys updates successfully", status_code: HttpStatus.ACCEPTED };
  }

  async findByEmailAndupdataPasscode(userId: ObjectId, passcode: string) {
    try {
      // Find the user by ID
      const user = await this.userModel.findOne({ _id: userId });
  
      // Check if the user exists
      if (!user) {
        return { success: false, message: "User not found", status: 404 };
      }
  
      // Hash the new passcode
      const hashedPasscode = bcrypt.hashSync(passcode, 10);
  
      // Update the user's passcode and email verification status
      const updateResult = await this.userModel.findByIdAndUpdate(user._id, {
        passcode: hashedPasscode,
        isEmailVerified: true,
      });
  
      // Ensure the update was successful
      if (!updateResult) {
        return { success: false, message: "Failed to update passcode", status: 500 };
      }
  
      // Generate a JWT token for the updated user
      const payload = { email: user.email, sub: user._id };
      const token = LoginJwtToken(payload);
  
      return { success: true, message: "Passcode updated successfully", status: 200, token };
    } catch (error) {
      // Handle unexpected errors
      return { success: false, message: "Internal server error", status: 500, error: error.message };
    }
  }
  

  async report(data:JSON)
{
  try {
    if (!data || Object.keys(data).length === 0) {
      throw new HttpException('Received JSON is empty',HttpStatus.BAD_REQUEST)
    }
    const res= await this.sendEmail(
      process.env.EMAIL_ADD_REPORT,
      'SwiftEx',
       JSON.stringify(data),
    );
    return res;
  } catch (error) {
    console.error('Report send faild:', error);
    throw new HttpException(error, 400)
  }
}

async sendEmail(to: string, subject: string, text: string,): Promise<any> {
  try{
    await this.mailerService.sendMail({
      to,
      from: process.env.EMAIL_ADD,
      subject,
      text,
    });
    
    return { statuscode: 200, message: 'Send successfully' ,status:"200"}  
  }
  catch(err)
  {
    return { errorCode: 500, errorMessage: 'Otp not Send.' }  
  }
}

async getStripeAccount(userId: ObjectId) {
  const user = await this.userModel.findOne({ _id: userId });
  if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return null
}

async syncDevice(userId: ObjectId, fcmRegToken: string, deviceInfo:object) {
  const synced = await this.userModel.updateOne(
    {
      _id: userId,
    },
    {
      $set: { fcmRegTokens: [fcmRegToken],DeviceInfo:deviceInfo },
    }
  );

  return { ...synced, success: true };
}
  // Apply for KYC
  async userKycApply(userId) {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user){
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await this.userModel.updateOne({ _id: userId }, { isVerified: true });
    return 'success';
  }
}

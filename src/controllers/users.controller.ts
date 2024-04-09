import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
  Param,
  Query,
  ParseIntPipe,
  Req,Res, NotFoundException
} from '@nestjs/common';
import { response } from 'express';
import { ObjectId } from 'mongoose';
import { BidSyncBodyDto } from 'src/dtos/bidSyncBody.dto';
import { NewStripeAccountDto } from 'src/dtos/newStripeAccount.dto';
import { NewUserDto } from 'src/dtos/newUser.dto';
import { phoneOtpDto } from 'src/dtos/phoneOtp.dto';
import { UpdateEmailDto } from 'src/dtos/updateEmail.dto';
import { UserLoginDto } from 'src/dtos/userLogin.dto';
import { VerifyEmailDto } from 'src/dtos/verifyEmail.dto';
import { UsersService } from 'src/services/users.service';
import { ObjectIdValidationPipe } from 'src/utils/validation.pipe';
import { Stripe } from 'stripe';
@Controller('users')
export class UsersController {
  private stripe: Stripe;
  constructor(private readonly UsersService: UsersService) {
    this.stripe = new Stripe('sk_test_51OSf1YSDyv8aVWPDeaJ9hWjya4bc6ojkuRof13ZFQLlwdOVUHyMYM5lt9vq4iTxJ9k2DldYMdSVjQUrMbv8UttQD00PMfckA0K',{
      apiVersion: '2020-08-27' as any,
    });
  }

 
  @Get()
  getAllUsers() {
    return this.UsersService.getAllUsers();
  }

  // Register new User
  @Post('register')
  @UsePipes(new ValidationPipe())
  register(@Body() newUser: NewUserDto) {
    return this.UsersService.register(newUser);
  }

  // Get user Details
  @Get('/getUserDetails')
  async getUserDetails(@Query('userId', ObjectIdValidationPipe) userId) {
    const user = await this.UsersService.getUserDetails(userId);
    if (!user)
      throw new HttpException('User Not Found', HttpStatus.BAD_REQUEST);

    return user;
  }

  // Apply for KYC
  @Post('kyc')
  userKycApply(@Query('userId', ObjectIdValidationPipe) userId: ObjectId) {
    return this.UsersService.userKycApply(userId);
  }

  // Login with phoneNumber
  // @Post('login')
  // @UsePipes(new ValidationPipe())
  // login(@Body() credintials: UserLoginDto) {
  //   return this.UsersService.login(credintials);
  // }

  //Login with Email
  @Post('login')
  @UsePipes(new ValidationPipe())
  login(@Body() credintials: phoneOtpDto) {
    return this.UsersService.login_email(credintials);
  }

   @Post('forgot_passcode')
  forgot_passcode(@Body() credintials: UserLoginDto) {
    return this.UsersService.forgot_email(credintials);
  }


  @Post('verifyLoginOtp')
  @UsePipes(new ValidationPipe())
  verifyLoginOtp(@Body() credintials: phoneOtpDto) {
    return this.UsersService.verifyLoginOtp(credintials);
  }

  @Post('createStripeAccount')
  @UsePipes(new ValidationPipe())
  createStripeAccount(
    @Body() accountBody: NewStripeAccountDto,
    @Query('userId', ObjectIdValidationPipe) userId: ObjectId,
  ) {
    return this.UsersService.createStripeAccount(userId, accountBody);
  }

  @Get('getStripeAccount')
  getStripeAccount(@Query('userId', ObjectIdValidationPipe) userId: ObjectId) {
    return this.UsersService.getStripeAccount(userId);
  }

  @Get('getStripeBalances')
  getStripeBalances(@Query('userId', ObjectIdValidationPipe) userId: ObjectId) {
    return this.UsersService.getStripeBalances(userId);
  }

  @Post('verifyUserEmail')
  @UsePipes(new ValidationPipe())
  verifyUserEmail(
    @Query('userId', ObjectIdValidationPipe) userId: ObjectId,
    @Body() emailBody: VerifyEmailDto,
  ) {
    return this.UsersService.verifyUserEmail(userId, emailBody);
  }

  @Post('updateEmail')
  @UsePipes(new ValidationPipe())
  updateEmail(
    @Query('userId', ObjectIdValidationPipe) userId: ObjectId,
    @Body() emailBody: UpdateEmailDto,
  ) {
    return this.UsersService.updateEmail(userId, emailBody.email);
  }

  // Device syncing
  @Get('getInSynced/:fcmRegToken')
  getInSynced(
    @Param('fcmRegToken') fcmRegToken: string,
    @Query('userId', ObjectIdValidationPipe) userId: ObjectId,
  ) {
    return this.UsersService.getInSynced(userId, fcmRegToken);
  }

  @Post('syncDevice')
  @UsePipes(new ValidationPipe())
  syncDevice(
    @Query('userId') userId: ObjectId,
    @Body() bidSyncBody: BidSyncBodyDto,
  ) {
    return this.UsersService.syncDevice(userId, bidSyncBody.fcmRegToken);
  }

  // Admin wallet
  @Get('getAdminWallet')
  getAdminWallet() {
    return this.UsersService.getAdminWallet();
  }

  // Transaction fee
  @Get('getTxFeeData/:assetName/:chainId')
  getTxFeeData(
    @Param('assetName') assetName: string,
    @Param('chainId', ParseIntPipe) chainId: number,
  ) {
    return this.UsersService.getTxFeeData(assetName, chainId);
  }

  @Post('ACTIVATE')
  create(@Body() postData: any) {
    console.log('Received POST request with data:', postData);
    return { message: 'Data received successfully', data: postData };
  }

  @Post('updatePublicKeyByEmail')
  async updatePublicKeyByEmail(
    @Body('email') email: string,
    @Body('publicKey') newPublicKey: string,
  ) {
    try {
      const result = await this.UsersService.findByEmailAndUpdatePublicKey(email, newPublicKey);
      console.log(">>>>",result)
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { success: false, message: 'User not found' };
      }
      throw error;
    }
  }

  @Post('updatePasscode')
  async updatePasscode(
    @Body('email') email:string,
    @Body('passcode') passcode:string,
    ){
      try {
        const result=await this.UsersService.findByEmailAndupdataPasscode(email,passcode);
        return result;
      } catch (error) {
        throw error;
      }
    }

    @Post('SendXETH')
    async SendXETH(
      @Body('email') email: string,
      @Body('amount') amount:string,
    ) {
        const result = await this.UsersService.sendXETH(email,amount);
        return response.status(200).json(result);
      }
}

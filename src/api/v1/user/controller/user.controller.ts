import { Controller, Get, Post, Body, Param, Delete, Put, HttpStatus, HttpCode, Query, UseGuards, HttpException, Req, NotFoundException } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateGuestUserDto, CreateUserDto, PasscodeDTO, UpdatePublicKey, UpdatePublicKeyNew, VerifyEmailDto } from '../dto/create-user.dto';
import { User } from '../schema/user.schema';
import { FcmTokenDto, OtpDto, UpdateUserDto } from '../dto/update-user.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ObjectIdValidationPipe } from '../../utils/validation.pipe';
import mongoose, { Types } from 'mongoose';
import { UserForgetDto } from '../../auth/dto/auth-credentials.dto';
import { swapAllbridgeDto } from '../../bridge/dto/swapAllbridgeDto';
import { SwapService } from '../../bridge/services/bridge.service';
import { BridgeUtils } from '../../bridge/utils/bridge.utils';
import { bridgeUtilsDto } from '../../bridge/dto/bridgeUtilsDto';
import { alchemyCreateOrder, alchemySellOrderDto, alchemyUserKyc, conversionQuote } from '../../alchemyPay/dto/alchemy.dto';


@Controller('/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly swapService: SwapService,
    private readonly bridgeUtils: BridgeUtils,
  ) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() newUser: CreateUserDto) {
    return this.userService.register(newUser);
  }
  @Post('/guestRegister')
  @HttpCode(HttpStatus.CREATED)
  async guestRegister(@Body() newUser: CreateGuestUserDto) {
    return this.userService.guestRegister(newUser);
  }

  @Post('/forgotPasscode')
  forgot_passcode(@Body() credintials: UserForgetDto) {
    return this.userService.forgotEmail(credintials);
  }

  @Post('/verifyLoginOtp')
  verifyLoginOtp(
    @Req() req: any,
    @Body() credintials: OtpDto) {
    return this.userService.verifyLoginOtp(req.user._id,credintials);
  }

  @Get('/:id')
  async getUserDetails(
    @Req() req: any,
  ) {
    const user = await this.userService.findOneById(req.user.sub);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Post('/updatePublicKeyByEmail')
  async updatePublicKeyByEmail(
    @Req() req: any,
    @Body() publicKey: UpdatePublicKey,
  ) {
    try {
      const result = await this.userService.findAndUpdatePublicKey(req.user.sub, publicKey.publicKey,publicKey.wallletPublicKey);
      console.log(">>>>", result)
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { success: false, message: 'User not found' };
      }
      throw error;
    }
  }

  @Post('/updatePublicKey')
  async updatePublicKey(
    @Req() req: any,
    @Body() publicKey: UpdatePublicKeyNew,
  ) {
    try {
      const result = await this.userService.UpdatePublicKey(req.user.sub, publicKey.publicKey,publicKey.wallletPublicKey);
      console.log(">>>>", result)
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { success: false, message: 'User not found' };
      }
      throw error;
    }
  }

  @Post('/verifyUserEmail')
  verifyUserEmail(
    @Req() req: any,
    @Body() emailBody: VerifyEmailDto,
  ) {
    return this.userService.verifyUserEmail(req.user.sub, emailBody);
  }

  @Get('/getInSynced/:fcmRegToken')
  getInSynced(
    @Param('fcmRegToken') fcmRegToken: string,
    @Req() req: any,
  ) {
    return this.userService.getInSynced(req.user.sub, fcmRegToken);
  }

  @Post('/syncDevice')
  syncDevice(
    @Req() req: any,
    @Body() FcmTokenbody: FcmTokenDto,
  ) {
    return this.userService.syncDevice(req.user.sub, FcmTokenbody.fcmRegToken,FcmTokenbody.deviceInfo);
  }

  @Post('/updatePasscode')
  async updatePasscode(
    @Req() req: any,
    @Body() {passcode}:PasscodeDTO,
    ){
      try {
        const result=await this.userService.findByEmailAndupdataPasscode(req.user._id,passcode);
        return result;
      } catch (error) {
        throw error;
      }
    }

    @Post('/kyc')
    userKycApply(
    @Req() req: any,
    ) {
      return this.userService.userKycApply(req.user.sub);
    }

  @Get('/getStripeAccount')
  handleStripeAccount(
    @Req() req: any,
  ) {
    return this.userService.getStripeAccount(req.user._id);
  }

    @Post('/reports')
    async handleJson(@Body() jsonData: any){
      return await this.userService.report(jsonData)
    }

    @Post('swap_exchange_prepare')
    async prepare_swap(@Body() body:swapAllbridgeDto) {
      const { fromAddress, toAddress, amount, sourceToken, destinationToken,walletType } = body;
      const res=await this.swapService.swap_prepare(fromAddress,toAddress,amount,sourceToken,destinationToken,walletType)
      console.log(res)
      return res
    }
  
    @Post('swap_exchange_execute')
    async execute_swap(@Body() body:swapAllbridgeDto) {
      const { fromAddress, toAddress, amount, sourceToken, destinationToken,walletType } = body;
      return await this.swapService.swap_execute(fromAddress,toAddress,amount,sourceToken,destinationToken,walletType)
    }

    @Post('/swapInfo')
    async getSwapDetails(@Body() query:bridgeUtilsDto) {
      return this.bridgeUtils.getSwapDetails(query.amount,query.chainType);
    }

    @Post('/alchemyQuotes')
    async getAlchemyQuotes(@Body() query:conversionQuote,@Req() req: any,) {
      return this.userService.fetchAlchemyQuotes(req.user.sub,query);
    }

    @Post('/alchemyUserRegister')
    async alchemyUserRegister(@Body() query:alchemyUserKyc,@Req() req: any,) {
      return this.userService.userRegisterForAlchemy(req.user.sub,query.businessSubType);
    }

    @Post('/alchemyKycStatus')
    async alchemyKycStatus(@Req() req: any,) {
      return this.userService.userKycStatus(req.user.sub);
    }

    @Post('/alchemyCreateOrder')
    async orderCreate(@Body() query:alchemyCreateOrder,@Req() req: any,) {
      return this.userService.alchemyOrder(req.user.sub,query);
    }

    @Post('/alchemySellOrderCreate')
    async sellOrder(@Body() query:alchemySellOrderDto,@Req() req: any,) {
      return this.userService.alchemySellOrderCreate(req.user.sub,query);
    }
  
    @Post('/alchemyOrders')
    async fetchOrders(@Req() req: any,) {
      return this.userService.getCreatedAlchemyOrders(req.user.sub);
    }
}

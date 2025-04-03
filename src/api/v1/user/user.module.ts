import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { EmailService } from '../utils/email.service';
import { NotificationService } from '../notification/service/notification.service';
import { SwapService } from '../bridge/services/bridge.service';
import { BridgeUtils } from '../bridge/utils/bridge.utils';


@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UserService,EmailService,NotificationService,SwapService,BridgeUtils],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}

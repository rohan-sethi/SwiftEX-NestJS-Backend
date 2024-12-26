import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { EmailService } from '../utils/email.service';
import { NotificationService } from '../notification/service/notification.service';


@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UserService,EmailService,NotificationService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}

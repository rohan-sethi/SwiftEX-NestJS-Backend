import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../user/schema/user.schema";
import { ContractTransactionListener } from "./transaction.listener";
import { NotificationService } from "../notification/service/notification.service";



@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [ContractTransactionListener,NotificationService],
})
export class ListenerModule {}

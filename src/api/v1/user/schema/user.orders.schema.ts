import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, ObjectId } from "mongoose";

@Schema({ collection:"userOrder", timestamps: true })
export class UserOrder extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'UserSchema', required:true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: false, sparse: true })
  email: string; 

  @Prop({ type: Object })
  deviceInfo:Object;

  @Prop({ required: true })
  orderId:string;
  
  @Prop({ type: Object,required:true })
  requsetdPayload:Object;
  
  @Prop({ required: true })
  url: string; 
  
  @Prop({ type: Object, default:{} })
  webhookResponse:Object;

  @Prop({ required: true })
  deviceFCM:string;

  @Prop({ required: true })
  orderType:string;

  @Prop({ default:'Pending' })
  status:string;
}

export const UserOrdersSchema = SchemaFactory.createForClass(UserOrder);

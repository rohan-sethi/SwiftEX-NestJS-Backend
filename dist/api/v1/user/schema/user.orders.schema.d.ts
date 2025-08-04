import mongoose, { Document, ObjectId } from "mongoose";
export declare class UserOrder extends Document {
    _id: ObjectId;
    userId: mongoose.Schema.Types.ObjectId;
    email: string;
    deviceInfo: Object;
    orderId: string;
    requsetdPayload: Object;
    url: string;
    webhookResponse: Object;
    deviceFCM: string;
    orderType: string;
    status: string;
}
export declare const UserOrdersSchema: mongoose.Schema<UserOrder, mongoose.Model<UserOrder, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, UserOrder>;

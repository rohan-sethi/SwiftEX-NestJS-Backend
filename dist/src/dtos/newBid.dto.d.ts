import { ObjectId } from 'mongoose';
export declare class NewBidDto {
    pricePerUnit: number;
    offer: ObjectId;
    currencyName: string;
}

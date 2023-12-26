import { IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';

export class AcceptABidDto {
  @IsNotEmpty()
  offerId: ObjectId;

  @IsNotEmpty()
  bidId: ObjectId;
}

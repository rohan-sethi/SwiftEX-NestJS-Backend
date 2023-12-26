import { IsString } from 'class-validator';

export class BidSyncBodyDto {
  @IsString()
  fcmRegToken: string;
}

import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Patch,
  Param,
  Headers,
  Query,
} from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { BidSyncBodyDto } from 'src/dtos/bidSyncBody.dto';
import { NewBidDto } from 'src/dtos/newBid.dto';
import { UpdateBidDto } from 'src/dtos/updateBid.dto';
import { BidsService } from 'src/services/bids.service';
import { ObjectIdValidationPipe } from 'src/utils/validation.pipe';

@Controller('api/bids')
export class BidsController {
  constructor(private readonly BidsService: BidsService) {}

  @Get()
  getAllBids(@Query('userId', ObjectIdValidationPipe) userId: ObjectId) {
    return this.BidsService.getAllBids(userId);
  }

  // Add new bid
  @Post('addNewBid')
  @UsePipes(new ValidationPipe())
  addNewBid(
    @Body() newBid: NewBidDto,
    @Query('userId', ObjectIdValidationPipe) userId: ObjectId,
  ) {
    return this.BidsService.addNewBid(newBid, userId);
  }

  // Update bid price
  @Patch('updateBidPrice/:id')
  @UsePipes(new ValidationPipe())
  updateBidPrice(
    @Param('id') bidId: ObjectId,
    @Query('userId', ObjectIdValidationPipe) userId: ObjectId,
    @Body() update: UpdateBidDto,
  ) {
    return this.BidsService.updateBidPrice(userId, bidId, update);
  }

  // Cancel a bid
  @Patch('cancelBid/:id')
  cancelBid(
    @Param('id') bidId: ObjectId,
    @Query('userId', ObjectIdValidationPipe) userId: ObjectId,
  ) {
    return this.BidsService.cancelBid(userId, bidId);
  }

  // Get bid details
  @Get('getBidDetails/:id')
  getBidDetails(
    @Param('id') bidId: ObjectId,
    @Query('userId', ObjectIdValidationPipe) userId: ObjectId,
  ) {
    return this.BidsService.getBidDetails(bidId, userId);
  }

  // Bid Syncing
  @Get('getInSyncedBids/:fcmRegToken')
  getInSyncedBids(
    @Param('fcmRegToken') fcmRegToken: string,
    @Query('userId', ObjectIdValidationPipe) userId: ObjectId,
  ) {
    return this.BidsService.getInSyncedBids(userId, fcmRegToken);
  }

  @Post('syncDevice')
  @UsePipes(new ValidationPipe())
  syncDevice(
    @Query('userId') userId: ObjectId,
    @Body() bidSyncBody: BidSyncBodyDto,
  ) {
    return this.BidsService.syncDevice(userId, bidSyncBody.fcmRegToken);
  }
}

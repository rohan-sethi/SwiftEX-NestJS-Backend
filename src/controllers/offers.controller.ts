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
import { AcceptABidDto } from 'src/dtos/acceptABid.dto';
import { NewOfferDto } from 'src/dtos/newOffer.dto';
import { OfferUpdateDto } from 'src/dtos/offerUpdate.dto';
import { ObjectIdValidationPipe } from 'src/utils/validation.pipe';
import { OffersService } from '../services/offers.service';

@Controller('offers')
export class OffersController {
  constructor(private readonly OffersService: OffersService) {}

  @Get()
  getAllOffers() {
    return this.OffersService.getAllOffers();
  }

  // Add offer
  @Post('addNewOffer')
  @UsePipes(new ValidationPipe())
  addNewOffer(
    @Body() newOffer: NewOfferDto,
    @Query('userId', ObjectIdValidationPipe) userId: ObjectId,
  ) {
    return this.OffersService.addNewOffer(newOffer, userId);
  }

  // Update offer
  @Patch('updateOffer/:id')
  @UsePipes(new ValidationPipe())
  updateOffer(
    @Param('id') offerId: ObjectId,
    @Body() update: OfferUpdateDto,
    @Query('userId', ObjectIdValidationPipe) userId: ObjectId,
  ) {
    return this.OffersService.updateOffer(userId, offerId, update);
  }

  // Cancel an offer
  @Patch('cancelOffer/:id')
  cancelOffer(
    @Param('id') offerId: ObjectId,
    @Query('userId', ObjectIdValidationPipe) userId: ObjectId,
  ) {
    return this.OffersService.cancelOffer(userId, offerId);
  }

  // Get offer details
  @Get('/getOfferDetails/:id')
  getOfferDetails(
    @Param('id') offerId: ObjectId,
    @Query('userId', ObjectIdValidationPipe) userId: ObjectId,
  ) {
    return this.OffersService.getOfferDetails(offerId, userId);
  }

  // Accept a bid
  @Post('acceptABid')
  @UsePipes(new ValidationPipe())
  acceptABid(
    @Body() body: AcceptABidDto,
    @Query('userId', ObjectIdValidationPipe) userId: ObjectId,
  ) {
    return this.OffersService.acceptABid(userId, body.bidId, body.offerId);
  }

  @Patch('cancelMatchedBid/:offerId')
  @UsePipes(new ValidationPipe())
  cancelMatchedBid (
    @Param('offerId', ObjectIdValidationPipe) offerId: ObjectId,
    @Query('userId', ObjectIdValidationPipe) userId: ObjectId,
  ) {
    return this.OffersService.cancelMatchedBid(userId, offerId);
  }
}

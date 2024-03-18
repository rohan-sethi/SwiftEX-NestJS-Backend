import { Controller, Query, Get, Post, Body } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { PayoutServices } from 'src/services/payout.services';
import { ObjectIdValidationPipe } from 'src/utils/validation.pipe';

@Controller('payout')
export class PayoutController {
  constructor(private readonly payoutServices: PayoutServices) {}

  @Get('myPayouts')
  getMyPayouts(@Query('userId', ObjectIdValidationPipe) userId: ObjectId) {
    return this.payoutServices.getAccoutnPayouts(userId);
  }
}

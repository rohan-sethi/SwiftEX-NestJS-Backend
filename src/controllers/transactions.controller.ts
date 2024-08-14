import {
  Controller,
  Headers,
  Post,
  Response,
  RawBodyRequest,
  Get,
  Req,
  Query,
  Param,
} from '@nestjs/common';
import Stripe from 'stripe';
import { Request } from 'express';
import { TransactionsService } from 'src/services/transactions.service';
import { ObjectIdValidationPipe } from 'src/utils/validation.pipe';
import { ObjectId } from 'mongoose';
import { PayoutServices } from 'src/services/payout.services';

const stripe = new Stripe(process.env.STRIPE_API_SK, {
  apiVersion: '2022-11-15',
});

@Controller('api/transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly payoutServices: PayoutServices,
  ) {}

  @Get('transactionDetails/:sessionId')
  async transactionDetails(@Param('sessionId') sessionId: string) {
    const tx = await this.transactionsService.getTxBySessionId(sessionId);
    return tx;
  }

  @Post('webhook')
  async webhook(
    @Headers('stripe-signature') sig,
    @Req() request: RawBodyRequest<Request>,
    @Response() response,
  ) {
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        request.rawBody,
        sig,
        process.env.STRIPE_ENDPOINT_SEC,
      );
    } catch (err) {
      console.log(err);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the payments event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      await this.transactionsService.completeTx(session);
    }

    if (event.type === 'checkout.session.async_payment_succeeded') {
      const session = event.data.object;
      await this.transactionsService.completeTx(session);
    }

    if (event.type === 'checkout.session.async_payment_failed') {
      const session = event.data.object;
      await this.transactionsService.updateFailedPaymentTx(session);
    }

    return response.status(200).send('ok');
  }

  @Post('webhook/connect')
  async connectWebhook(
    @Headers('stripe-signature') sig,
    @Req() request: RawBodyRequest<Request>,
    @Response() response,
  ) {
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        request.rawBody,
        sig,
        process.env.STRIPE_ENDPOINT_CONNECT_SEC,
      );
    } catch (err) {
      console.log(err);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    if (event.type === 'account.updated') {
      const account = event.data.object;
      await this.transactionsService.updateUserAccount(account);
    }

    if (event.type === 'payout.failed') {
      const payout = event.data.object;
      await this.payoutServices.handlePayoutFailureEvent(payout, event.account);
    }

    if (event.type === 'payout.paid') {
      const payout = event.data.object;
      await this.payoutServices.handlePayoutFailureEvent(payout, event.account);
    }

    return response.status(200).send('ok');
  }

  @Get('getUserTansactions')
  getUserTansactions(
    @Query('userId', ObjectIdValidationPipe) userId: ObjectId,
  ) {
    return this.transactionsService.getUserTansactions(userId);
  }
}

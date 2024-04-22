import { Body, Controller, Get, Headers, NotFoundException, Param, Post, Query, RawBodyRequest, Req, Response } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/models/user.model';
import { StripeWebhookService } from 'src/services/stripe-webhook.service';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_API_SK, {
    apiVersion: '2022-11-15',
  });

@Controller('stripe-payment')
export class stripe_controller{
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private readonly StripeWebhookService:StripeWebhookService
      ) {}
      @Post('payment_link')
      async payment_link(
        @Body('id') id: string,
        @Body('amount') amount: number,
        @Body('XUSD_amount') XUSD_amount: string,

      ){
        try {
          const result = await this.StripeWebhookService.payment_link(id,amount,XUSD_amount);
          console.log(">>>>",result)
          return result;
        } catch (error) {
          if (error instanceof NotFoundException) {
            return { success: false, message: 'User not found' };
          }
          throw error;
        }
      }

      @Get(':mail/:amount')
      async processPayment(
        @Param('mail') mail: string,
        @Param('amount') amount: string,
      ){
        return this.StripeWebhookService.sendPayment(mail,amount);
      }
}

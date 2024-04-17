import { Controller, Get, Headers, Post, RawBodyRequest, Req, Response } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/models/user.model';
import { StripeWebhookService } from 'src/services/stripe-webhook.service';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_API_SK, {
    apiVersion: '2022-11-15',
  });

@Controller('stripe-webhook')
export class stripe_controller{
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private readonly StripeWebhookService:StripeWebhookService
      ) {}
    @Post('webhook')
    async webhook(
      @Headers('stripe-signature') sig,
      @Req() request: RawBodyRequest<Request>,
      @Response() response,
    ) {
        console.log("-----------------called");
      let event;
      try {
        event = stripe.webhooks.constructEvent(
          request.rawBody,
          sig,
          process.env.STRIPE_ENDPOINT_SEC,
        );
        // Handle the payments event
      if (event.type === 'charge.succeeded') {
        const session = event.data.object;
        console.log("---------+++++++++++++++++++++++++--------called",session);
          await this.StripeWebhookService.find_user(event.data.object.amount_captured,event.data.object.billing_details.email)
      }
      } catch (err) {
        console.log(err);
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }
  
      // Handle the payments event
      if (event.type === 'charge.succeeded') {
        const session = event.data.object;
        console.log("---------+++++++++++++++++++++++++--------called",session);
          await this.StripeWebhookService.find_user(event.data.object.amount_captured,event.data.object.billing_details.email)
      }
  
      return response.status(200).send('ok');
    }

    
}

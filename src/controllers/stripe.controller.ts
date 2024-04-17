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
      } catch (err) {
        console.log(err);
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }
  
      // Handle the payments event
      if (event.type === 'charge.succeeded') {
        const session = event.data.object;
        console.log("-------------------event.type---------------",event.type)
        const amount = event.data.object.amount_captured;
        console.log("-------------------amount---------------",amount)
        const formattedNumber = `${amount
            .toString()
            .slice(0, -2)}.${amount.toString().slice(-2)}`;
        console.log('Amount:', formattedNumber);
        const currency = event.data.object.currency;
        console.log('Amount type:', currency);
        const email = event.data.object.billing_details.email;
        console.log('Email:', email);
        const emailExist = await this.userModel.findOne({ email: email });
        if (emailExist === null) {
            console.log("user not found")
        }
        else {
            console.log(">>: ", emailExist)
            console.log("++++++>", emailExist.public_key)
            console.log("---------------------------------------------------")
            // const ReciverPublicKey = 'GCUOMNFW7YG55YHY5S5W7FE247PWODUDUZ4SOVZFEON47KZ7AXFG6D6A';

            // this.sendPayment(emailExist.public_key)
        }
        // await this.StripeWebhookService.sendPayment
      }
  
      return response.status(200).send('ok');
    }
}

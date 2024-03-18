import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import express from 'express';
import { Stripe } from 'stripe';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/models/user.model';
import { Model } from 'mongoose';
import * as Stellar from 'stellar-sdk';

@Injectable()
export class Payout_listion implements OnModuleInit{
    private readonly logger = new Logger(Payout_listion.name);
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {
        Stellar.Network.useTestNetwork();
    }
    onModuleInit() {
        this.listenForTransactions();
        this.listenForTransactionsXETH();
      }

     listenForTransactions() {
    const accountId="GBCNZEEQXSVQ3O6DWJXAOVGUT3VRI2ZOU2JB4ZQC27SE3UU4BX7OZ5DN";
    const server = new Stellar.Server('https://horizon-testnet.stellar.org');

    const transactionStream = server.transactions()
      .forAccount(accountId)
      .cursor('now')
      .stream({
        onmessage: (transaction) => {
          this.logger.log('Transaction Received XUSD:<>');
          this.logger.log(transaction);
          this.logger.log(transaction.memo);
          this.logger.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
          const a = transaction.memo;
          const dataBeforeHyphen = a.split("-")[0];
          const dataAfterHyphen = a.split("-")[1];
          this.check(dataBeforeHyphen,dataAfterHyphen);
        },
        onerror: (error) => {
          this.logger.error('Error in XUSD transaction stream :', error);
        },
      });
      this.logger.log(`Listening for XUSD...`);
     }

    

async check(get_email,get_amount) {
    const  phoneNumber  = get_email;
    const emailExist = await this.userModel.findOne({ email: phoneNumber });
    if(emailExist===null)
    {
     console.log("user not found")
    }
    else{
     console.log(">>: ",emailExist)
     console.log("++++++>",emailExist.stripeAccountId)
     this.sendMoneyToBank(emailExist.stripeAccountId, get_amount, "inr",)
    }
   }
   
   async sendMoneyToBank(receiverAccountId: string, amount: number, currency: string): Promise<any>{
    const stripe = require('stripe')('sk_test_51OSf1YSDyv8aVWPDeaJ9hWjya4bc6ojkuRof13ZFQLlwdOVUHyMYM5lt9vq4iTxJ9k2DldYMdSVjQUrMbv8UttQD00PMfckA0K');
    try {
        const transfer = await stripe.transfers.create({
          amount,
          currency,
          destination: receiverAccountId,
        });
        console.log('Transfer successful:', transfer);
      } catch (error) {
        console.error('Error:', error.message);
      }
   }

   listenForTransactionsXETH() {
    const accountId="GCW6DBA7KLB5HZEJEQ2F5F552SLQ66KZFKEPPIPI3OF7XNLIAGCP6JER";
    const server = new Stellar.Server('https://horizon-testnet.stellar.org');

    const transactionStream = server.transactions()
      .forAccount(accountId)
      .cursor('now')
      .stream({
        onmessage: (transaction) => {
          this.logger.log('Transaction Received for XETH:<>');
          this.logger.log(transaction);
          this.logger.log(transaction.memo);
          this.logger.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
          const a = transaction.memo;
          const dataBeforeHyphen = a.split("-")[0];
          const dataAfterHyphen = a.split("-")[1];
          this.check_(dataBeforeHyphen,dataAfterHyphen);
        },
        onerror: (error) => {
          this.logger.error('Error in XETH transaction stream :', error);
        },
      });
      this.logger.log(`Listening for XETH...`);
     }
     async check_(get_email,get_amount) {
      const  phoneNumber  = get_email;
      const emailExist = await this.userModel.findOne({ email: phoneNumber });
      if(emailExist===null)
      {
       console.log("user not found")
      }
      else{
       console.log(">>: ",emailExist)
       console.log("++++++>",emailExist.stripeAccountId)
      }
     }

//    async sendMoneyToBank(accountId: string, amount: number, currency: string): Promise<any> {
//     try {
//         const stripe = new Stripe('sk_test_51OSf1YSDyv8aVWPDeaJ9hWjya4bc6ojkuRof13ZFQLlwdOVUHyMYM5lt9vq4iTxJ9k2DldYMdSVjQUrMbv8UttQD00PMfckA0K', {
//             apiVersion: '2020-08-27' as any,
//         });
//       const payout = await stripe.payouts.create({
//         amount,
//         currency,
//         source_type: 'bank_account',
//         destination: accountId,
//       });
//       console.log('Payout created:', payout);
//       return payout;
//     } catch (error) {
//       console.log('Error creating payout:', error);
//       // throw error;
//     }
//   }
}
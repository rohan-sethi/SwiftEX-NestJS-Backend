import { Injectable, Logger } from '@nestjs/common';
import express from 'express';
import { Stripe } from 'stripe';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/models/user.model';
import { Model } from 'mongoose';
import * as StellarSdk from 'stellar-sdk';

@Injectable()
export class StripeWebhookService {
    private readonly logger = new Logger(StripeWebhookService.name);
    private server: StellarSdk.Server;
    private senderKeypair: StellarSdk.Keypair;
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {
        this.setupWebhook();
        StellarSdk.Network.useTestNetwork();
        this.server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
        this.senderKeypair = StellarSdk.Keypair.fromSecret('SB2IR7WZS3EDS2YEJGC3POI56E5CESRZPUVN72DWHTS4AACW5OYZXDTZ');
    }
    private setupWebhook() {
        const stripe = new Stripe('sk_test_51OSf1YSDyv8aVWPDeaJ9hWjya4bc6ojkuRof13ZFQLlwdOVUHyMYM5lt9vq4iTxJ9k2DldYMdSVjQUrMbv8UttQD00PMfckA0K', {
            apiVersion: '2020-08-27' as any,
        });
        const app = express();
        const endpointSecret = 'whsec_75b73d751f3eef37cf2e8a4f01a74e2d2fbb70a6828ed949d4d382a46858d3cf';

        app.post(
            '/webhook',
            express.raw({ type: 'application/json' }),
            async (request, response) => {
                const sig = request.headers['stripe-signature'];

                let event;
         
                try {
                    event = stripe.webhooks.constructEvent(
                        request.body,
                        sig,
                        endpointSecret,
                    );
                    console.log("----------event----------,",event);
                    console.log("-------------event---------",event);
                } catch (err) {
                    this.logger.error(`Webhook Error: ${err.message}`);
                    response.status(400).send(`Webhook Error: ${err.message}`);
                    return;
                }

                switch (event.type) {
                    
                    case 'charge.succeeded':
                        console.log("-------------------event.type---------------",event.type)
                        const amount = event.data.object.amount_captured;
                        console.log("-------------------amount---------------",amount)
                        const formattedNumber = `${amount
                            .toString()
                            .slice(0, -2)}.${amount.toString().slice(-2)}`;
                        this.logger.log('Amount:', formattedNumber);
                        const currency = event.data.object.currency;
                        this.logger.log('Amount type:', currency);
                        const email = event.data.object.billing_details.email;
                        this.logger.log('Email:', email);
                        const emailExist = await this.userModel.findOne({ email: email });
                        if (emailExist === null) {
                            console.log("user not found")
                        }
                        else {
                            console.log(">>: ", emailExist)
                            console.log("++++++>", emailExist.public_key)
                            console.log("---------------------------------------------------")
                            // const ReciverPublicKey = 'GCUOMNFW7YG55YHY5S5W7FE247PWODUDUZ4SOVZFEON47KZ7AXFG6D6A';

                            this.sendPayment(emailExist.public_key)
                        }
                        break;
                }
                 console.log("----------------response-----------------")
                response.send();
            },
        );
        const port = 4242;
        app.listen(port, () => {
            this.logger.log(`Stripe Webhook is running on port ${port}`);
        });
    }

    async sendPayment(recipientPublicKey: string): Promise<void> {
        try {
            const account = await this.server.loadAccount(this.senderKeypair.publicKey());

            const XETHAsset = new StellarSdk.Asset('XUSD', 'GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI');
            const transaction = new StellarSdk.TransactionBuilder(account, {
                fee: StellarSdk.BASE_FEE,
                networkPassphrase: StellarSdk.Networks.TESTNET,
            })
                .addOperation(
                    StellarSdk.Operation.payment({
                        destination: recipientPublicKey,
                        asset: XETHAsset,
                        amount: '1',
                    })
                )
                .setTimeout(30)
                .build();

            transaction.sign(this.senderKeypair);

            const transactionResult = await this.server.submitTransaction(transaction);
            console.log('Transaction Successful to: ', recipientPublicKey);
        } catch (error) {
            console.error('Error making payment:', error);
        }
    }
}

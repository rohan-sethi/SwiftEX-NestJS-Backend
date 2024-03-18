import { Injectable, HttpException, HttpStatus,Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User, UserDocument } from 'src/models/user.model';
import { PayoutRepository } from 'src/repositories/payout.repository';
import { NOTIFICATION_TYPES_ENUM } from 'src/utils/constants';
import { pushNotification } from 'src/utils/fcmHandler';
import Stripe from 'stripe';
import Stellar from "stellar-sdk";

@Injectable()
export class PayoutServices {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly payoutRepository: PayoutRepository,
    ) {}
  private readonly logger = new Logger(PayoutServices.name);
  createPayout(userId: ObjectId) {}
  getPayout(payoutId: string) {}

  async getAccoutnPayouts(userId: ObjectId) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const { data } = await this.payoutRepository.getAccountPayouts(
      user.stripeAccountId,
      { limit: 10 },
    );

    return data;
  }

  // Event Handling
  async handlePayoutFailureEvent(
    payoutObject: Stripe.Payout,
    stripeAccountId: string,
  ) {
    const user = await this.userModel.findOne({ stripeAccountId });
    if (!user) return;

    const notificationData = {
      type: NOTIFICATION_TYPES_ENUM.PAYOUT_FAILED,
      targetUser: user._id.toString(),
      isActionRequired: '',
      message: `Your payout with the amount of ${
        payoutObject.amount
      } ${payoutObject.currency.toUpperCase()} amount has failed`,
    };

    await pushNotification({
      tokens: user.fcmRegTokens,
      notification: {
        title: 'Payout Failed',
        body: 'One of your payouts is failed',
      },
      data: notificationData,
    });
  }

  async handlePayoutPaidEvent(
    payoutObject: Stripe.Payout,
    stripeAccountId: string,
  ) {
    const user = await this.userModel.findOne({ stripeAccountId });
    if (!user) return;

    const notificationData = {
      type: NOTIFICATION_TYPES_ENUM.PAYOUT_SUCCEEDED,
      targetUser: user._id.toString(),
      isActionRequired: '',
      message: `Your payout with the amount of ${
        payoutObject.amount
      } ${payoutObject.currency.toUpperCase()} amount is paid and expected to arrive soon`,
    };

    await pushNotification({
      tokens: user.fcmRegTokens,
      notification: {
        title: 'Payout Succeeded',
        body: 'One of your payouts is paid and expected to arrive soon',
      },
      data: notificationData,
    });
  }

}

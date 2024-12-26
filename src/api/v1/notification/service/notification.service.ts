import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor() {
    // Initialize Firebase Admin SDK
    if (!admin.apps.length) {
      const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      this.logger.log('Firebase Admin SDK initialized');
    }
  }

  /**
   * Send notification to a single device using its device token.
   * @param deviceToken - The device token to send the notification to
   * @param title - Notification title
   * @param body - Notification body
   * @param imageUrl - Optional image URL for the notification
   */
  async sendNotification(
    deviceToken: string,
    title: string,
    body: string,
    imageUrl: string = '',
  ): Promise<void> {
    const message = {
      notification: {
        title,
        body,
        image: imageUrl,
      },
      token: deviceToken,
    };

    try {
      const response = await admin.messaging().send(message);
      this.logger.log(`Successfully sent message: ${response}`);
    } catch (error) {
      this.logger.error(`Error sending message: ${error.message}`, error.stack);
    }
  }
}
